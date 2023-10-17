import i18n from 'locales';
import {
  useQueryClient,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import Icon from 'components/common/Icon/Icon';
import Text from 'components/common/Text/Text';
import { TouchableOpacity, View } from 'react-native';
import { ApiErrorResponse } from 'types/ApiResponse';
import fallbackErrorStyles from './FallbackError.style';

const FallbackError = ({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) => {
  const { reset } = useQueryErrorResetBoundary();
  const queryClient = useQueryClient();

  const err = error as ApiErrorResponse;
  const data = err.response?.data;
  const errorMessage = data?.message;

  const resetErrors = () => {
    queryClient.clear();
    reset();
    resetError();
  };

  return (
    <View style={[fallbackErrorStyles.container]}>
      <View style={fallbackErrorStyles.iconWrapper}>
        <Icon name="IconExit" fill="white" />
      </View>
      <Text variant="h4" style={fallbackErrorStyles.errorText}>
        {errorMessage ?? i18n.t('default_error_message')}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={fallbackErrorStyles.button}
        onPress={resetErrors}
      >
        <Text variant="h4">{i18n.t('back_to_home')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FallbackError;
