interface HeaderProps {
  description?: string;
}

function Header({
  description = 'Планувальник навчальних завдань',
}: HeaderProps) {
  return (
    <div className="header">
      <h1>Study Planner</h1>
      <p>{description}</p>
    </div>
  );
}

export default Header;
