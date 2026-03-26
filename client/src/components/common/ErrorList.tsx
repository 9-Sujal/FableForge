

export default function ErrorList({errors}: {errors?: string[]}) {
   if(!errors) return null;
    return (
      <div className="text-xs text-red-400 space-y-1">
      {errors.map((err) => {
        return <p key={err}>{err}</p>;
      })}
    </div>
  )
}
