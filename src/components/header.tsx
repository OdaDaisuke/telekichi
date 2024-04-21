export const AppHeader = () => {
  const d = new Date()
  const month = d.getMonth() + 1
  const today = d.getDate()

  return <header className="flex bg-black px-8 py-2">
    <h1 className="text-white text-2xl font-bold">テレ吉</h1>
    <span className="ml-4 text-xl font-italic">{month}月{today}日</span>
  </header>
}
