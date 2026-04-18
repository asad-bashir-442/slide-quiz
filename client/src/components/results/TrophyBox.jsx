export function TrophyBox({ rank, name, score, percent }) {
    return (
        <div className="card card-side bg-base-300 shadow-md w-full max-w-2xl h-28 p-4">
            {/* Image */}
            <figure className="w-1/3 flex items-center justify-center bg-base-300">
                <div className="w-16 h-16 flex items-center justify-center">
                    <img src={`/images/trophies/${rank}.svg`} alt="Picture of a trophy" className="max-w-full max-h-full object-contain" />
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
