import { useReducer } from "react";

function withState(
	WrappedComponent
) {
	return (props) => {
		const {onChange, onFocus, onBlur} = props;
		const [state, setState] = useReducer(
			(oldState, newState) => ({...oldState, ...newState}),
			{
				hasFocus: false,
				beenBlurred: false,
				value: props.value || '',
			}
		);
		const handleChange = (e) => {
			setState({value: e.target.value});
			return onChange && onChange(e);
		}
		const handleFocus = (e) => {
			setState({hasFocus: true});
			return onFocus && onFocus(e);
		}
		const handleBlur = (e) => {
			setState({hasFocus: false, beenBlurred: true});
			return onBlur && onBlur(e);
		}
		return (
			<WrappedComponent
				{...props}
				{...state}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
			/>
		);
	};
}

export default withState;
