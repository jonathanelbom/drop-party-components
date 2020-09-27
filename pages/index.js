import Head from 'next/head';
import {Button, Select, SelectControlled, Input, InputControlled, ImageCarousel} from '../components';
import styles from '../styles/App.module.css';
import { useState } from 'react';

// sample data
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
const images = new Array(8).fill('').map((v, index) => (
  {
      src: `https://placeimg.com/600/600/people/${index}`,
      alt: `Image ${index}`,
  }
));

// sample callback handlers
const onClick = () => console.log('you clicked button');
const onInputChange = (e) => console.log('Input > change, value:', e.target.value);
const onSelectChange = (e) => console.log('Select > change, value:', e.target.value);
const onImageCarouselChange = (index) => console.log('ImageCarousel > change, index:', index);


export default function App() {
  const [controlledInputValue, setControlledInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  return (
    <div className={styles.App}>
      <div className={styles.with_padding}>
        <h2>{'Drop Party UI Components'}</h2>
      </div>
      <div className={styles.with_padding}>
        <h3>{'Image Carousel'}</h3>
        <h4>{'300px tall, start at first image'}</h4>
      </div>
      <ImageCarousel images={images}  onChange={onImageCarouselChange}/>
      <div className={styles.with_padding}>
        <h4>{'500px tall, start at fourth image'}</h4>
      </div>
      <ImageCarousel images={images} height= {500} index={3} onChange={onImageCarouselChange}/>
      <div className= {styles.with_padding}>
        <h3>{'Inputs'}</h3>
        <h4>{'Text'}</h4>
        <InputControlled id="input-0-0" label="Controlled Input" value={controlledInputValue} onChange={(e) => setControlledInputValue(e.target.value)}/>
        <Input id="input-0" label="Uncontrolled Input" onChange={onInputChange}/>
        <Input id="input-1" label="Name" value="Marco Marandiz" error="Your name is wrong." onChange={onInputChange}/>
        <Input id="input-2" label="Disabled" disabled onChange={onInputChange}/>
        <h4>{'Phone'}</h4>
        <Input id="input-3" type="tel" onChange={onClick}/>
        <Input id="input-4"type="tel" value="+1 512-555-4444" onChange={onInputChange} verified/>
        <Input id="input-5" type="tel" value="+1 512-555-4444" onChange={onInputChange} error="Error message is displayed here."/>
        <Input id="input-6"type="tel" label="Disabled" disabled onChange={onInputChange}/>
        <h3>{'Buttons'}</h3>
        <h4>{'Primary'}</h4>
        <Button label={'Purchase'} onClick={onClick}/>
        <Button label={'Purchase'} disabled onClick={onClick}/>
        <h4>{'Secondary'}</h4>
        <Button label={'Purchase'} secondary onClick={onClick}/>
        <Button label={'Purchase'} secondary disabled onClick={onClick}/>
        <h3>{'Selects'}</h3>
        <h4>{'Regular'}</h4>
        <SelectControlled
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          id="select-0"
        >
          {selectOptions}
        </SelectControlled>
        <Select
          value={selectValue}
          onChange={onSelectChange}
          disabled
          id="select-1"
        >
          {selectOptions}
        </Select>
        <Select
          value={selectValue}
          onChange={onSelectChange}
          error="Error message is displayed here"
          id="select-2"
        >
          {selectOptions}
        </Select>
        <div className={styles['mini-select']}>
          <h4>{'Mini'}</h4>
          <Select
            value={selectValue}
            onChange={onSelectChange}
            id="select-3"
          >
            {selectOptions}
          </Select>
          <Select
            value={selectValue}
            onChange={onSelectChange}
            disabled
            id="select-4"
          >
            {selectOptions}
          </Select>
          <Select
            value={selectValue}
            onChange={onSelectChange}
            error="Error message is displayed here"
            id="select-5"
          >
            {selectOptions}
          </Select>
        </div>
      </div>
    </div>
  )
}
