import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import Head from 'next/head';
import React, { useReducer, useState } from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import { ImageCarousel, Button, BottomSheet, InputControlled } from 'components';

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

const DropSignupPage = () => {
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
						// disabled
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
					// disabled
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
					{'Drop Party - Registration'}
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
		</div>
	);
};

export default DropSignupPage;
