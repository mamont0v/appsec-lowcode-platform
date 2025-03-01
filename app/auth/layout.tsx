const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="
          h-full flex items-center justify-center absolute inset-0  h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"
    >
      {children}
    </div>
  );
};

export default AuthLayout;
