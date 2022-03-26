function DateInput() {
  function handleChange(event) {
    console.log(event.target.value);
  }
  return <input type="date" onChange={handleChange} />;
}

export default DateInput;
