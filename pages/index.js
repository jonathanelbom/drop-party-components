import Head from 'next/head';
// import Head from 'next/head';
import Button from '../components/Button/Button';
import Select from '../components/Select/Select';
import ImageCarousel from '../components/ImageCarousel/ImageCarousel';
import styles from '../styles/App.module.css';
import { useState } from 'react';

const selectOptions = [
  <option disabled value='' key="drop-down-option-default">{'Drop Down label'}</option>,
  ...new Array(4).fill('').map((otion, index) => (
    <option
      key={`drop-down-option-${index}`}
      value={`option-${index + 1}`}
    >
      {`Drop Down option ${index + 1}`}
    </option>
  ))
];

const onClick = () => alert('you clicked me');

export default function App() {
  const [selectValue, setSelectValue] = useState('');
  const onSelectChange = (value) => {
    setSelectValue(value);
  }

  return (
    <div className={styles.App}>
      <Button label={'Purchase'} onClick={onClick}/>
      <Button label={'Purchase'} disabled onClick={onClick}/>
      <Button label={'Purchase'} secondary onClick={onClick}/>
      <Button label={'Purchase'} secondary disabled onClick={onClick}/>
      <Select
        value={selectValue}
        onChange={onSelectChange}
      >
        {selectOptions}
      </Select>
      <Select
        value={selectValue}
        onChange={onSelectChange}
        disabled
      >
        {selectOptions}
      </Select>
      <Select
        value={selectValue}
        onChange={onSelectChange}
        error="Error message is displayed here"
      >
        {selectOptions}
      </Select>
      <div className={styles['mini-select']}>
        <Select
          value={selectValue}
          onChange={onSelectChange}
        >
          {selectOptions}
        </Select>
        <Select
          value={selectValue}
          onChange={onSelectChange}
          disabled
        >
          {selectOptions}
        </Select>
        <Select
          value={selectValue}
          onChange={onSelectChange}
          error="Error message is displayed here"
        >
          {selectOptions}
        </Select>
      </div>
    </div>
  )
}

// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Create Next App</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//         <div className={styles.grid}>
//           <a href="https://nextjs.org/docs" className={styles.card}>
//             <h3>Documentation &rarr;</h3>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className={styles.card}>
//             <h3>Learn &rarr;</h3>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/master/examples"
//             className={styles.card}
//           >
//             <h3>Examples &rarr;</h3>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//           >
//             <h3>Deploy &rarr;</h3>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
//         </a>
//       </footer>
//     </div>
//   )
// }
