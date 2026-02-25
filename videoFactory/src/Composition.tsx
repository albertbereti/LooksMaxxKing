import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const EliteAscension: React.FC<{ userName: string; smvScore: number }> = ({ userName, smvScore }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 150], [1, 1.2]);

    return (
        <AbsoluteFill style={{
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'system-ui',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            {/* BACKGROUND GRADIENT */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
                transform: `scale(${scale})`
            }} />

            {/* CONTENT */}
            <div style={{ opacity, textAlign: 'center', zIndex: 10 }}>
                <h2 style={{
                    fontSize: '40px',
                    letterSpacing: '0.2em',
                    color: '#888',
                    textTransform: 'uppercase'
                }}>
                    Structural Audit
                </h2>
                <h1 style={{
                    fontSize: '120px',
                    fontWeight: 900,
                    margin: '20px 0',
                    background: 'linear-gradient(to right, #fff, #444)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {userName}
                </h1>
                <div style={{
                    fontSize: '60px',
                    color: '#daa520',
                    fontWeight: 'bold',
                    border: '2px solid #daa520',
                    padding: '20px 40px',
                    borderRadius: '50px',
                    display: 'inline-block'
                }}>
                    SCORE: {smvScore}
                </div>
            </div>

            {/* OVERLAY ELEMENTS */}
            <div style={{
                position: 'absolute',
                bottom: '100px',
                width: '100%',
                textAlign: 'center',
                fontSize: '30px',
                color: '#444',
                letterSpacing: '0.5em'
            }}>
                ASCENSION PROGRAM LIVE
            </div>
        </AbsoluteFill>
    );
};
