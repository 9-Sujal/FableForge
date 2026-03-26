import { Spinner } from "@heroui/react";


export default function LoadingSpinner({label}: {label?: string}) {
  return (
     <div className="flex items-center justify-center p-10">
      <Spinner label={label} color="warning" />
    </div>
  )
}
