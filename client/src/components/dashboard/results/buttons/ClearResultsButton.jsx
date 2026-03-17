import { X } from "lucide-react";
import { toast } from "sonner";

export function ClearResultsButton() {
  const handleClose = () => {
    document.getElementById("clear_results_modal").close();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Connect this to the API

    try {
      toast.success("Cleared results!");
      handleClose();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <button
        className="btn btn-error"
        onClick={() => document.getElementById("clear_results_modal").showModal()}
      >
        <X />
        Clear All Results
      </button>

      <dialog
        id="clear_results_modal"
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to clear all results?
            </h3>
          <p className="text-center pt-4 font-bold">This action is irreversible!</p>
          <div className="modal-action">
            <form onSubmit={handleSubmit}>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => document.getElementById("clear_results_modal").close()}
              >
                ✕
              </button>

              <div className="modal-action">
                <button
                  onClick={handleClose}
                  type="reset"
                  className="btn btn-ghost"
                >
                  Cancel
                </button>

                {/* TODO: Maybe an icon here */}
                <button type="submit" className="btn btn-error">
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

