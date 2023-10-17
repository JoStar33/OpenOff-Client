import i18n from 'locales';
import { OpenEvent } from 'components/openEvent';
import StatusType from 'constants/app/status';
import { View } from 'react-native';
import { useOpenEventStore } from 'stores/OpenEventStore';
import recruitmentNumberStyles from './RecruitmentNumber.style';

const RecruitmentNumber = () => {
  const {
    openEvent,
    setOpenEvent,
    openEventErrorMessage,
    setOpenEventErrorMessage,
  } = useOpenEventStore();
  const { recruitmentNumber } = openEvent;
  const hasError = !!openEventErrorMessage.recruitmentNumber;

  const handleChangeText = (value: string) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return;
    }
    if (hasError) {
      setOpenEventErrorMessage({
        ...openEventErrorMessage,
        recruitmentNumber: null,
      });
    }

    if (numericValue === 0) {
      setOpenEvent({
        ...openEvent,
        recruitmentNumber: null,
      });
      return;
    }
    setOpenEvent({
      ...openEvent,
      recruitmentNumber: numericValue,
    });
  };

  return (
    <View>
      <OpenEvent.Label content={i18n.t('recruitment_number')} />

      <View style={recruitmentNumberStyles.inputWithHelpText}>
        <OpenEvent.Input
          placeholder="80"
          style={recruitmentNumberStyles.input}
          keyboardType="numeric"
          value={recruitmentNumber ? recruitmentNumber.toString() : ''}
          onChangeText={handleChangeText}
        />

        {hasError && (
          <OpenEvent.HelpText
            status={StatusType.error}
            content={openEventErrorMessage.recruitmentNumber ?? ''}
          />
        )}
      </View>
    </View>
  );
};

export default RecruitmentNumber;
