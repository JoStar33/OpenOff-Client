import { NavigationProp, useNavigation } from '@react-navigation/native';
import CurrentFindButton from 'components/eventMap/buttons/CurrentFindButton/CurrentFindButton';
import MyCoordinateButton from 'components/eventMap/buttons/MyCoordinateButton/MyCoordinateButton';
import MapFieldButtonGroup from 'components/eventMap/groups/MapFieldButtonGroup/MapFieldButtonGroup';
import MapHeader from 'components/eventMap/headers/MapHeader/MapHeader';
import EventSearchInput from 'components/eventMap/inputs/EventSearchInput/EventSearchInput';
import EventMarker from 'components/eventMap/maps/EventMarker/EventMarker';
import MapBottomSheet from 'components/eventMap/sheets/MapBottomSheet/MapBottomSheet';
import eventList from 'data/lists/eventList';
import useEventMapSelector from 'hooks/eventMap/useEventMapSelector';
import useMapCoordinateInfo from 'hooks/eventMap/useMapCoordinateInfo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Dimensions, View } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import { Field } from 'types/apps/group';
import NaverMapEvent from 'types/apps/map';
import { RootStackParamList } from 'types/apps/menu';
import getDistanceCoordinate from 'utils/coordinate';
import {
  defaultTabBarStyles,
  eventMapScreenStyles,
} from './EventMapScreen.style';

const EventMapScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [fieldMapMode, setFieldMapMode] = useState<Field | undefined>(
    undefined,
  );
  const [currentFindActive, setCurrentFindActive] = useState<boolean>(false);
  // 스크린 위치 & 현재 위치 & 초기 지도위치 & 네이버 맵 useRef
  const {
    screenCoordinate,
    currentCoordinate,
    firstPlaceCoordinate,
    naverMapRef,
    focusCoordinate,
    setFocusCoordinate,
  } = useMapCoordinateInfo();
  // 거리순, 날짜순 정렬 및 선택자(비용 & 참여인원 & 신청현황)
  const { sort, setSort, selectState, dispatch } =
    useEventMapSelector(eventList);
  // 클릭된 마커의 아이디값
  const [clickedMarker, setClickedMarker] = useState<string | null>(null);
  // 검색어값
  const searchValue = useRef<string>('');
  // 해당함수를 통해 search값 반영
  const handleEventSearch = useCallback((value: string) => {
    searchValue.current = value;
  }, []);
  const handleMoveCurrentCoordinate = () => {
    naverMapRef.current?.animateToCoordinate(currentCoordinate);
  };
  const handleShowFieldEvent = useCallback(
    (field: Field) => {
      setFieldMapMode(field);
      navigation.setOptions({
        tabBarStyle: {
          ...defaultTabBarStyles,
          display: 'none',
        },
      });
      setClickedMarker(null);
    },
    [navigation],
  );
  const handleCameraEvent = (event: NaverMapEvent) => {
    screenCoordinate.current = {
      latitude: event.latitude,
      longitude: event.longitude,
    };
    setCurrentFindActive(() => {
      return (
        getDistanceCoordinate(focusCoordinate, {
          latitude: event.latitude,
          longitude: event.longitude,
        }) > 0.1
      );
    });
  };
  const recallEventMap = () => {
    navigation.setOptions({
      tabBarStyle: {
        ...defaultTabBarStyles,
        display: 'flex',
      },
    });
    setFieldMapMode(() => {
      return undefined;
    });
  };
  const computedEventList = useMemo(() => {
    if (!clickedMarker) return eventList;
    return eventList.filter((event) => event.id === clickedMarker);
  }, [clickedMarker]);
  useEffect(() => {
    const backAction = () => {
      if (fieldMapMode) {
        recallEventMap();
        console.log('run');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={eventMapScreenStyles.container}>
      {fieldMapMode ? (
        <MapHeader title={fieldMapMode.label} backPress={recallEventMap} />
      ) : (
        <>
          <EventSearchInput handleSearch={handleEventSearch} />
          <MapFieldButtonGroup handleShowFieldEvent={handleShowFieldEvent} />
        </>
      )}
      <View style={eventMapScreenStyles.mapContainer}>
        {fieldMapMode ? (
          <CurrentFindButton
            handlePress={() => {
              setCurrentFindActive(false);
              setFocusCoordinate(screenCoordinate.current);
            }}
            isFindActive={currentFindActive}
          />
        ) : (
          <MyCoordinateButton handlePress={handleMoveCurrentCoordinate} />
        )}
        <NaverMapView
          ref={naverMapRef}
          showsMyLocationButton={false}
          style={eventMapScreenStyles.map}
          center={{ ...firstPlaceCoordinate, zoom: 16 }}
          onCameraChange={handleCameraEvent}
          onMapClick={() => {
            setClickedMarker(null);
          }}
        >
          <Marker
            image={require('../../../assets/images/currentCoordinate.png')}
            width={50}
            height={50}
            coordinate={currentCoordinate}
            pinColor="blue"
          />
          {eventList.map((event) => (
            <EventMarker
              key={event.id}
              clickedMarker={clickedMarker}
              setClickedMarker={setClickedMarker}
              event={event}
            />
          ))}
        </NaverMapView>
      </View>
      <MapBottomSheet
        snapTop={clickedMarker ? (1 / 3) * Dimensions.get('window').height : 80}
        snapBottom={(2 / 3) * Dimensions.get('window').height}
        sort={sort}
        setSort={setSort}
        selectState={selectState}
        dispatch={dispatch}
        clickedMarker={clickedMarker}
        eventList={computedEventList}
      />
    </View>
  );
};

export default EventMapScreen;
