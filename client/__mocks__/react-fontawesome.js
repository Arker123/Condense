const FontAwesomeIcon = ({ icon }) => {
    // Mocked Font Awesome icon rendering
    return (
        <span
            className={`fa fa-${icon}`}
            data-testid="font-awesome-icon"
        ></span>
    );
};

export { FontAwesomeIcon };