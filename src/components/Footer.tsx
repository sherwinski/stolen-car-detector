export function Footer() {
  return (
    <div className="flex flex-col gap-4 mb-32 text-center lg:mb-0 lg:w-full lg:grid-cols-4 lg:text-left sticky bottom-0 py-12 px-24 bg-background opacity-80">
      Made with Roboflow 🤖
      <p className="text-slate-500">
        <b>Hint:</b> If you want to test something quickly, try searching for
        <code className="italic text-orange-500"> &quot;ALI&quot;</code>.
        Alternatively, you could try an empty search.
      </p>
    </div>
  )
}
