function Button({ btnclasses = "", btnid = "", btnclick, btntext = "", btntype = "button" }) {
    return (
        <button
            className={btnclasses}
            id={btnid}
            onClick={btnclick}
            type={btntype}
        >
            {btntext}
        </button>
    )
}
export default Button