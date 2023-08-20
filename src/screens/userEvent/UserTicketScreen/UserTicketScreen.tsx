import { useState } from 'react';
import { Dimensions, LayoutChangeEvent, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useUserTickets } from 'hooks/queries/ledger';
import useNavigator from 'hooks/navigator/useNavigator';
import useStackRoute from 'hooks/navigator/useStackRoute';
import {
  CONSTANT_PARTICIPANT,
  UserTicketStatus,
} from 'constants/userEvent/participant/participantConstants';
import { MyTicketInfoResponseDto } from 'models/ledger/response/MyTicketInfoResponseDto';
import { StatusButton, TicketCard } from 'components/userEvent/participant';
import { StackMenu } from 'constants/menu';
import userTicketScreenStyles from './UserTicketScreen.style';

const UserTicketScreen = () => {
  const { params } = useStackRoute<StackMenu.UserTicket>();
  const { stackNavigation } = useNavigator();

  /**
   * carousel ui 관련
   */
  const { width } = Dimensions.get('window');
  const [carouselHeight, setCarouselHeight] = useState<number>(
    CONSTANT_PARTICIPANT.CAROUSEL_INITIAL_HEIGHT,
  );
  const handleHeight = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setCarouselHeight(height + CONSTANT_PARTICIPANT.QR_BUTTON_HEIGHT);
  };

  /**
   * ticket 정보
   */

  const { data: tickets } = useUserTickets({
    eventInfoId: params.eventId,
  });

  const eventTicketStatus = (
    ticketInfo: MyTicketInfoResponseDto,
  ): UserTicketStatus => {
    if (new Date(ticketInfo.eventDate) < new Date()) {
      return UserTicketStatus.ENDED;
    }
    if (ticketInfo.isJoined) {
      return UserTicketStatus.ATTENDED;
    }
    if (ticketInfo.qrImageUrl) {
      return UserTicketStatus.APPROVED;
    }
    return UserTicketStatus.WAITING;
  };

  /**
   * qr 보러가기
   */

  const handlePressQR = (ticketIndex: string) => {
    if (!tickets) {
      return;
    }

    stackNavigation.navigate('UserQR', {
      eventId: params.eventId,
      ticketId: ticketIndex,
    });
  };

  if (!tickets) {
    return null;
  }

  return (
    <View style={userTicketScreenStyles.container}>
      <Carousel
        // TODO: loop아닌척하기 - 후순위
        loop
        width={width * 0.86}
        height={carouselHeight}
        overscrollEnabled={false}
        panGestureHandlerProps={{ minDist: 24 }}
        style={[userTicketScreenStyles.carousel, { width }]}
        mode="parallax"
        modeConfig={{
          parallaxScrollingOffset: 64,
          parallaxScrollingScale: 0.9,
          parallaxAdjacentItemScale: 0.77,
        }}
        data={tickets}
        renderItem={({ item }) => (
          <>
            <TicketCard
              key={item.eventIndexId}
              onLayout={handleHeight}
              ticketInfo={item}
            />
            <StatusButton
              status={eventTicketStatus(item)}
              ticketType={item.ticketType}
              onPress={() => handlePressQR(item.ticketIndex)}
            />
          </>
        )}
      />
    </View>
  );
};

export default UserTicketScreen;
