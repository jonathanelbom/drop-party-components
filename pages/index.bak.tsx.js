import type { ParsedUrlQuery } from 'querystring';

import { NotFound } from 'http-errors';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import { compose } from 'lodash/fp';
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useReducer, useState } from 'react';
import type { FunctionComponent } from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import { useAsync } from 'react-use';

import { ImageCarousel, Button, BottomSheet, InputControlled } from 'components';
import type { Drop } from 'models/drops';
import { useIntent } from 'models/intents/hooks';
import type { Product } from 'models/products';
import { withFallback, withHttpError } from 'utils/hocs';
import type { HttpErrorProps } from 'utils/pages';
import { propsToStaticProps, returnClientErrors, returnServerErrors, wrapWithServerError } from 'utils/pages';
import { firestore } from 'vendors/firebase/firestore';
import { converter } from 'vendors/firebase/firestore/utils';
import { captureExceptions } from 'vendors/sentry/utils';

import styles from './Registration.module.scss';

const data = {
	brandLogo: {
		src: '/brand-logo.png', // 'https://placeimg.com/163/27/tech',
		alt: 'Brand image',
	},
	images: new Array(4).fill('').map((v, index) => ({
		src: `https://placeimg.com/600/600/people/${index}`,
		alt: `Image ${index}`,
	})),
	productBrandSuper: 'Aimé Leon Dore',
	product: 'Plaid Trouser',
	price: '$265',
	viewCount: '140',
	viewLabel: 'Viewing',
	registeredCount: '310',
	registeredLabel: 'Registered',
	detailsLabel: 'Product Details',
	details: 'PLAID COTTON PANT. FEATURES 100% COTTON TWILL, SLIM FIT, TWO SLASH POCKETS, TWO BACK WELT POCKETS, BRANDED BUTTON CLOSURE AND BRANDED WOVEN LABEL AT BACK POCKET.',
	registerLabel: 'Register for this Drop',
	registerTitle: 'Register with your number',
	registerDetails: 'We’ll send you quick and simple updates via text. That’s right. Your phone is your login.',
	verifyNumber: 'Verify your number',
	codeTitle: 'Verification Code',
	codeDetails: 'Enter the verification code we texted to ',
	codeButton: 'Let\'s Go!',
	codeInputPlaceholder: 'Verification Code',
	phoneInputPlaceholder: '(555) 555-5555'
};

interface Params extends ParsedUrlQuery {
	drop: string;
}

interface Props {
	drop: Drop;
	products: Product[];
}

const DropSignupPage: FunctionComponent<Props> = ({ drop, products }) => {
	const { isFallback } = useRouter();
	// const [phoneNumberInput, setPhoneNumberInput] = useState<string>('');
	// const [phoneNumber, setPhoneNumber] = useState<string>();
	// const [pageState, setPageState] = useState<string>('register');
	
	// store state in reducer
	const [state, setState] = useReducer((state, newState) => {
		return {...state, ...newState}
	}, {
		phoneNumberInput: new AsYouType('US').input('512587294'), // '',
		phoneNumber: '',
		pageState: 'register',
		isPhoneValid: false,
		isPhoneError: false,
		phoneFocused: false,
		phoneHasBeenBlurred: false,
		codeInput: '',
		isCodeValid: false,
		isCodeError: false,
		codeFocused: false,
		codeHasBeenBlurred: false,
	});

	// phone input handlers
	const handlePhoneNumberChange = (e) => {
		const masked = new AsYouType('US').input(e.target.value);
		const parsed = parsePhoneNumberFromString(masked, 'US');
		const isPhoneValid = parsed && parsed.isValid();
		setState({
			phoneNumberInput: masked,
			isPhoneValid,
			isPhoneError: !isPhoneValid && (state.phoneHasBeenBlurred || masked.length === 14)
		});
	};
	const handlePhoneFocus = (e) => {
		setState({phoneFocused: true});
	};
	const handlePhoneBlur = (e) => {
		setState({
			phoneFocused: false,
			phoneHasBeenBlurred: true,
			isPhoneError: !state.isPhoneValid
		});
	};
	const handleSubmitNumber = () => {
		setState({pageState: 'code'});
	};

	// verification code input handlers
	const handleCodeChange = (e) => {
		const value = e.target.value;
		const isCodeValid = value.length === 6 && !isNaN(Number(value));
		setState({
			codeInput: value,
			isCodeValid,
			isCodeError: !isCodeValid && (state.codeHasBeenBlurred || value.length === 6)
		});
	};
	const handleCodeFocus = (e) => {
		setState({codeFocused: true});
	};
	const handleCodeBlur = (e) => {
		setState({
			codeFocused: false,
			codeHasBeenBlurred: true,
			isCodeError: !state.isCodeValid
		});
	};
	const handleSubmitCode = () => {
		setState({pageState: 'number'});
	};

	const { data: intent, set: setIntent } = useIntent(drop, state.phoneNumber);

	const { error, loading } = useAsync(async () => state.phoneNumber && await setIntent({ id: state.phoneNumber, slug: null }), [state.phoneNumber, setIntent]);

	const renderFormPage = () => {
		if (state.pageState === 'number') {
			return (
				<div className={styles['Registration__form-page']}>
					<span className="h3 bold" style={{marginBottom: '6px'}}>{data.registerTitle}</span>
					<span style={{marginBottom: '25px'}} >{data.registerDetails}</span>
					<InputControlled
						id="register-phone-number"
						type="tel"
						verified={state.isPhoneValid}
						error={state.isPhoneError}
						disabled={Boolean(intent) || loading}
						value={state.phoneNumberInput}
						onChange={handlePhoneNumberChange}
						placeholder={state.phoneFocused ? '' : data.phoneInputPlaceholder}
						onFocus={handlePhoneFocus}
						onBlur={handlePhoneBlur}
						maxLength={14}
					/>
					<Button label={data.verifyNumber} disabled={!state.isPhoneValid} onClick={handleSubmitNumber} />
				</div>
			);
		}
		return (
			<div className={styles['Registration__form-page']}>
				<span className="h3 bold" style={{marginBottom: '6px'}}>{data.codeTitle}</span>
				<span style={{marginBottom: '25px'}} >{data.codeDetails}<b>{`(xxx) xxx-${state.phoneNumberInput.substr(10)}`}</b></span>
				<InputControlled
					id="register-code"
					type="tel"
					verified={state.isCodeValid}
					error={state.isCodeError}
					disabled={Boolean(intent) || loading}
					value={state.codeInput}
					onChange={handleCodeChange}
					placeholder={state.codeFocused ? '' : data.codeInputPlaceholder}
					onFocus={handleCodeFocus}
					onBlur={handleCodeBlur}
					maxLength={6}
				/>
				<Button label={data.codeButton} disabled={!state.isCodeValid} onClick={handleSubmitCode} />
			</div>
		)
	}

	return (
		<div className={styles.Registration}>
			<Head>
				<title>
					{drop.label}
				</title>
			</Head>
			<div className={styles['brand-heading']}>
				<img src={data.brandLogo.src} alt={data.brandLogo.alt} />
			</div>
			<ImageCarousel
				height={346}
				index={0}
				images={data.images}
			/>
			<div className={styles['product-body']}>
				<span className="small">{data.productBrandSuper}</span>
				<div className={styles['product-heading']}>
					<span className="black">{data.product}</span>
					<span className="black">{data.price}</span>
				</div>
				<div className={styles['product-stats']}>
					<span>
						<span>{'👀 '}</span>
						<span className="bold">{`${data.viewCount} `}</span>
						<span>{data.viewLabel}</span>
					</span>
					<span>
						<span className="bold">{`${data.registeredCount} `}</span>
						<span>{data.registeredLabel}</span>
					</span>
				</div>
				<span className={styles['details-label']}>{data.detailsLabel}</span>
				<span className={styles['details']}>{data.details}</span>
				<div className={styles['fixed-footer']}>
					<Button label={data.registerLabel} onClick={() => setState({pageState: state.isPhoneValid ? 'code' : 'number'})}/>
				</div>
			</div>
			<BottomSheet
				show={state.pageState === 'number' || state.pageState === 'code'}
				dismiss={() => setState({pageState: 'register'})}
			>
				<SwitchTransition mode="out-in">
					<CSSTransition
						key={`Registration__form-${state.pageState}`}
						timeout={250}
						classNames="Registration__form-trans"
					>
						{renderFormPage()}
					</CSSTransition>
				</SwitchTransition>
			</BottomSheet>
			{/* <form
				onSubmit={(event): void => {
					event.preventDefault();
					const parsed = parsePhoneNumberFromString(phoneNumberInput, 'US');
					if (!parsed || !parsed.isValid()) {
						return;
					}
					setPhoneNumber(parsed.number as string);
				}}
			>
				<input
					type="tel"
					disabled={Boolean(intent) || loading}
					value={phoneNumberInput}
					onChange={({ target: { value } }): void => setPhoneNumberInput(new AsYouType('US').input(value))}
				/>
				<input
					type="submit"
					disabled={Boolean(intent) || loading}
				/>
			</form> */}
			{/* <pre>
				Drop:
				{' '}
				{JSON.stringify(drop, null, 4)}
			</pre>
			<pre>
				Intent:
				{' '}
				{JSON.stringify(intent, null, 4)}
			</pre>
			<pre>
				Error:
				{' '}
				{JSON.stringify(error, null, 4)}
			</pre>
			<pre>
				Products:
				{' '}
				{JSON.stringify(products, null, 4)}
			</pre> */}
		</div>
	);
};

export default compose(
	withFallback(),
	withHttpError()
)(DropSignupPage);

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
	fallback: true,
	paths:    (
		await firestore
			.collection('drops')
			.withConverter(converter<Drop>())
			.get()
	)
		.docs
		.map((doc) => ({ params: { drop: doc.data().slug } })),
});

export const getStaticProps: GetStaticProps<Props | HttpErrorProps, Params> = compose( // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- FIXME compose causes eslint errors
	propsToStaticProps<Props | HttpErrorProps>({ revalidate: 1 }),
	returnServerErrors(),
	wrapWithServerError(),
	captureExceptions(),
	returnClientErrors()
)(async ({ params }: GetStaticPropsContext<Params>): Promise<Props> => {
	const { docs } = await firestore
		.collection('drops')
		.where('slug', '==', params!.drop)
		.withConverter(converter<Drop>())
		.get();

	if (!docs.length) {
		throw NotFound(`No Drop at ${params!.drop}`);
	}
	const drop = docs[0].data();

	return {
		drop,
		products: await Promise.all(
			(drop.products ?? []).map(async ({ id }) => (
				await firestore
					.collection('products')
					.doc(id)
					.withConverter(converter<Product>())
					.get()
			)
				.data()!)
		),
	};
});
