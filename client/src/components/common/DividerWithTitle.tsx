import { Divider } from "@heroui/react";


export default function DividerWithTitle({title}: {title: string}) {
    if(!title) return null;
  return (
        <div>
      <p className="dark:bg-white dark:text-black bg-black text-white p-1 inline-block font-semibold rounded-t">
        {title}
      </p>
      <Divider className="dark:bg-white bg-black" />
    </div>
  )
}
