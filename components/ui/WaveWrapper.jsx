

const WaveWrapper = ({ color }) => {
    return (
        <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
                backgroundColor: color,
                borderRadius: "0 0 0% 50% / 0 0 50% 100%",
                zIndex: 1,
            }}
        />
    )
}

export default WaveWrapper