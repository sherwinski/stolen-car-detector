export default function MapLink({
  latitude,
  longitude,
}: {
  latitude: string
  longitude: string
}) {
  return (
    <a href={`https://www.google.com/maps?q=${latitude},${longitude}`}>
      <span className=" text-blue-500">Maps</span>
    </a>
  )
}
