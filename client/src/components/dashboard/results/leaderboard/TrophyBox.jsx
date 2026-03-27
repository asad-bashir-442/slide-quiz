export function TrophyBox({rank, name, score, percent}) {
    let imagePath = "";
    if (rank === 1){
        imagePath = "/images/trophies/1st.svg";
    }
    else if (rank === 2){
        imagePath = "/images/trophies/2nd.svg";
    }
    else if (rank === 3){
        imagePath = "/images/trophies/3nd.svg";
    }

    return(
        <div className="card card-side bg-base-100 shadow-md w-full max-w-md">

            {/* Image (≈30%) */}
            <figure className="w-1/3">
                <img
                    src={imagePath}
                    alt="Picture of a trophy"
                    className="h-full w-full object-cover"
                />
            </figure>

            {/* Text (≈70%) */}
            <div className="card-body w-2/3 p-4">
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