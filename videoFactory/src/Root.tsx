import { Composition } from 'remotion';
import { EliteAscension } from './Composition';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="EliteAscension"
                component={EliteAscension}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    userName: "TITAN",
                    smvScore: 9.8,
                }}
            />
        </>
    );
};
