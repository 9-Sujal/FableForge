import { Card, CardBody, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useEffect, useState } from "react";

import {Book} from "epubjs";
interface Props {
  book: Book | null;
  notes?: string[];
  isOpen?: boolean;
  onClose?(): void;
  onNoteClick?(path: string): void;
}
interface BookWithRange extends Book {
  getRange(cfi: string): Promise<Range>;
}

export default function NotesModal({ book, notes, isOpen, onClose, onNoteClick }: Props) {
 const [data, setData] = useState<{ note: string; cfi: string }[]>([]);

  useEffect(() => {
    if (!notes || !book) return;

    const newNotes = Promise.all(
      notes.map(async (cfi) => {
        const note = (await (book as BookWithRange).getRange(cfi)).toString();
        return { note, cfi };
      })
    );

    newNotes.then(setData);
  }, [notes, book]);

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex items-center justify-center">
          Notes & Highlights
        </ModalHeader>
        <ModalBody className="flex flex-col gap-6 items-center">
          {data.map((item) => {
            return (
              <Card key={item.cfi} className="max-w-2xl">
                <CardBody
                  className="cursor-pointer"
                  onClick={() => {
                    onNoteClick?.(item.cfi);
                    onClose?.();
                  }}
                >
                  <p className="line-clamp-3">{item.note}</p>
                </CardBody>
              </Card>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};