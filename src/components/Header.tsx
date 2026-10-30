interface HeaderProps {
  description?: string;
}

function Header({
  description = 'Планувальник навчальних завдань',
}: HeaderProps) {
  return (
    <header>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Planner</h1>
      <p className="text-gray-600 mb-8">{description}</p>
    </header>
  );
}

export default Header;
