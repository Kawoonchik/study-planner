interface HeaderProps {
  label?: string;
}

function Header({ label = 'Header' }: HeaderProps) {
  return (
    <div className="header" aria-label={label}>
      <h2>Header</h2>
    </div>
  );
}

export default Header;
