import { Divider } from "@heroui/react";


export default function DividerWithTitle({title}: {title: string}) {
    if(!title) return null;
  return (
        <div>
      <p className=" dark:text-white text-black text-2xl p-2 inline-block font-semibold rounded-t">
        {title}
      </p>
      <Divider className="dark:bg-white bg-black" />
    </div>
  )
}
