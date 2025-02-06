import React from "react";
import "./ResetButton.css";

interface ButtonProps {
    label: string;
    onClick: () => void;
}

const ResetButton: React.FC<ButtonProps> = ({ label, onClick }) => {
    return <button className="resetButton" onClick={onClick}>{label}</button>;
};

export default ResetButton;