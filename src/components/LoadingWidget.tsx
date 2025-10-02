import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useLoadingState } from '@/stores/loading.store';

export default function LoadingWrapper({ children }: any) {
	const loading = useLoadingState((state) => state.loading);

	return (
		<View className="flex-1">
			{loading && <LoadingView />}
			{children}
		</View>
	);
}

function LoadingView() {
	return (
		<BlurView
			experimentalBlurMethod="dimezisBlurView"
			className="absolute inset-0 z-10 items-center justify-center"
			style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
		>
			<View className="relative items-center justify-center">
				{/* Circular spinner */}

				{/* Logo positioned in the middle */}
				<View className="absolute h-[64] w-[64] rounded-full items-center justify-center bg-white">
				<Progress.CircleSnail
					size={64}
                    
					thickness={3}
					color={["#000"]}
					indeterminate
				/>
					<Image
						source={require("@/assets/images/logo.png")}
                        className='absolute'
						style={{
                            height: 40, 
                            width: 40,
                            position: 'absolute',
                        }}
                        transition={200}
                        contentFit='contain'
					/>
				</View>
			</View>
		</BlurView>
	);
}