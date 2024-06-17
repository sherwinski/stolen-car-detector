export function Footer() {
  return (
    // <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
    <div className="flex flex-col gap-4 mb-32 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
      Made with Roboflow 🤖
      <p className="text-slate-500">
        <b>Hint:</b> If you want to test something quickly, try searching for{' '}
        <code className="italic text-orange-500">"ALI"</code>. Alternatively,
        you could try an empty search.
      </p>
    </div>
  )
}
