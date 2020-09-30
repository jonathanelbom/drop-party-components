import type { FunctionComponent } from 'react';
import React from 'react';

import styles from './Hero.module.scss';

const Hero: FunctionComponent = () => (
	<div className={styles.hero}>
		<img className={styles.heroImage} alt="Drop Party" src="/drop-party-logo.png" />
		<div className={styles.heroText}>
			Drops Platform: Not for Everyone
		</div>
		<a className={styles.heroContact} href="mailto:marco@drop.party" target="_blank" rel="noreferrer">
			Contact Us
		</a>
	</div>
);

export default Hero;
