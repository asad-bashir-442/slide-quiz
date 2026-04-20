import { deleteResponseById, getAllResponses } from "../../../../api/responses";
import { truncateText } from "../../../../utility/truncate";

import { toast } from "sonner";

export function DeleteResultsButton({ id, name, setResponses }) {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await deleteResponseById(id);

            const responses = await getAllResponses();

            document.getElementById(`delete_result_modal/${id}`).close();

            setResponses(responses?.data);
            toast.success("result deleted");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <button onClick={() => document.getElementById(`delete_result_modal/${id}`).showModal()} className="btn btn-outline max-[900px]:w-full btn-error">
                Delete
            </button>

            <dialog id={`delete_result_modal/${id}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg" title={name}>
                        Are you sure you want to delete "{truncateText(name, 15)}"
                    </h3>

                    <p className="text-center pt-4 font-bold">This action is irreversible!</p>
                    <div className="modal-action">
                        <form onSubmit={handleSubmit} className="max-[900px]:w-full">
                            <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById(`delete_result_modal/${id}`).close()}>
                                ✕
                            </button>

                            <div className="modal-action max-[900px]:block max-[900px]:w-full">
                                <button onClick={() => document.getElementById(`delete_result_modal/${id}`).close()} type="reset" className="btn max-[900px]:mb-4 max-[900px]:w-full">
                                    Cancel
                                </button>

                                <button type="submit" className="btn btn-error max-[900px]:w-full">
                                    Yes I know what I'm doing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}
