"use client";
import {
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs';
import ActiveCollaborators from "./ActiveCollaborators";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { updateDocument } from "@/lib/actions/room.action";

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {

    const CurrentUserType = 'editor';
    const [documentTitle, setDocumentTitle] = useState(roomMetadata?.title || "Untitled Document");
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLoading(true);
            try {
                if (documentTitle !== roomMetadata.title) {
                    await updateDocument(roomId, documentTitle);
                }
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
            setEditing(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false);
                updateDocument(roomId,documentTitle)
            }

        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [roomId,documentTitle]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<div>Loading…</div>}>
                <div className="collaborative-room">
                    <Header>
                        <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
                            {editing && !loading ? (
                                <Input
                                    type="text"
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder="Enter the Title"
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className="document-title-input"
                                />
                            ) : (
                                <p className="document-title">{documentTitle}</p>
                            )}

                            {CurrentUserType === 'editor' && !editing && (
                                <Image
                                    src="/assets/icons/edit.svg"
                                    alt="edit"
                                    height={24}
                                    width={24}
                                    onClick={() => setEditing(true)}
                                    className="cursor-pointer"
                                />
                            )}
                            {CurrentUserType !== 'editor' && !editing && (
                                <p className="view-only-tag">View Only</p>
                            )}

                            {loading && <p className="text-sm text-gray-400">saving...</p>}
                        </div>
                        <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                            <ActiveCollaborators />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
};

export default CollaborativeRoom;
