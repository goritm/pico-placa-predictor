const Input = ({ license, dispatch }) => {
  return (
    <input
      className="licenseInput"
      type="text"
      placeholder="ABC1234"
      value={license.toUpperCase()}
      onChange={({ target: { value } }) => {
        if (value.length > 7) return;
        return dispatch({ type: "LICENSE", payload: value });
      }}
    />
  );
};

export default Input;
