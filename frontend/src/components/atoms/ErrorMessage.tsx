type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div style={{ color: "red" }}>{message}</div>;
};

export default ErrorMessage;
