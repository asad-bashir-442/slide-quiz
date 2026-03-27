export function TrophyBox({ rank, name, score, percent }) {
    let imagePath = "";
    if (rank === 1) {
        imagePath = "/images/trophies/1st.svg";
    } else if (rank === 2) {
        imagePath = "/images/trophies/2nd.svg";
    } else if (rank === 3) {
        imagePath = "/images/trophies/3rd.svg";
    }

    return (
        <div className="card card-side bg-base-100 shadow-md w-full max-w-2xl h-28">

            {/* Image */}
            <figure className="w-1/3 flex items-center justify-center bg-base-200">
                <div className="w-16 h-16 flex items-center justify-center">
                    <img
                        src={imagePath}
                        alt="Picture of a trophy"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            </figure>

            {/* Text */}
            <div className="card-body w-2/3 p-3 justify-center">
                <h2 className="card-title text-lg">{name}</h2>

                <p className="text-sm">
                    <span className="font-semibold">Score:</span> {score}
                </p>

                <p className="text-sm">
                    <span className="font-semibold">Percent:</span> {percent}%
                </p>
            </div>
        </div>
    );
}