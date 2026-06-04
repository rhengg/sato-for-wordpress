import React from "react";
import './inputPassword.css'

type InputPasswordType = {
  value: string
}
const InputPassword = (props: InputPasswordType) => {
  const { value } = props
  const [visibility, setVisibility] = React.useState(true);

  const handleToggle = () => {
    setVisibility(!visibility);
  }
  return (
    <div className="api-value-input-box"
    >
      <input
        className="input-secondary"
        style={{ width: '100%' }}
        autoComplete="off"
        type={visibility ? "password" : "text"}
        disabled
        value={value}
      />

      <span
        style={{
          position: "absolute",
          top: "50%",
          transform: 'translateY(-50%)',
          right: "1rem",
          color: "black",
          cursor: "pointer",
        }}
        onClick={() => {
          handleToggle()
        }}
        className="material-symbols-outlined"
      >
        {visibility ? "visibility" : "visibility_off"}
      </span>
    </div>
  )
}
export default InputPassword
