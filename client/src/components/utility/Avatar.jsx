import { useAuth } from "../../context/AuthContext";

export function Avatar() {
    const { user } = useAuth();
    const name = user?.name ? user.name.charAt(0) : "?";

    return (
        <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
                <span className="text-3xl">{name}</span>
            </div>
        </div>
    );
}
