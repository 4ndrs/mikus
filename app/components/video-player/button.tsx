type Props = React.ComponentProps<"button">;

const Button = ({ children, className, ...props }: Props) => (
  <div className="text-[1.5rem] text-white">
    <button
      {...props}
      className={
        (className || "") +
        " flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out hover:bg-black/20"
      }
    >
      {children}
    </button>
  </div>
);

export default Button;
