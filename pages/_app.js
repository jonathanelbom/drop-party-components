import Head from 'next/head';
import 'styles/globals.scss'

const MyApp = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet" />
			</Head>
			<Component {...pageProps} />
		</>
	);
};

export default MyApp
