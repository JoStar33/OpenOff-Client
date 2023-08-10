import { loginWithKakaoAccount } from '@react-native-seoul/kakao-login';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { clearToken } from 'apis';
import { AxiosError } from 'axios';
import JoinButton from 'components/authorize/buttons/JoinAndFindButton/JoinAndFindButton';
import LoginButton from 'components/authorize/buttons/LoginButton/LoginButton';
import SocialLoginButtonGroup from 'components/authorize/groups/SocialLoginButtonGroup/SocialLoginButtonGroup';
import LoginInput from 'components/authorize/inputs/LoginInput/LoginInput';
import Text from 'components/common/Text/Text';
import CommonLoading from 'components/suspense/loading/CommonLoading/CommonLoading';
import { useNormalLogin, useSocialLogin } from 'hooks/queries/auth';
import { useContext, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { useAuthorizeStore } from 'stores/Authorize';
import { colors } from 'styles/theme';
import { ApiResponse } from 'types/ApiResponse';
import { AuthStackParamList } from 'types/apps/menu';
import DialogContext from 'utils/DialogContext';
import { validateEmail, validatePassword } from 'utils/validate';
import loginScreenStyles from './LoginScreen.style';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [emailAddress, setEmailAddress] = useState<string>('');

  const { setIsLogin, resetToken } = useAuthorizeStore();

  const { openDialog } = useContext(DialogContext);

  const [password, setPassword] = useState<string>('');

  const handleLoginError = (error: AxiosError<ApiResponse>) => {
    openDialog({
      type: 'validate',
      text: error.response?.data.message ?? '서버에 오류가 발생했습니다.',
    });
  };

  const handleSocialLoginError = (error: AxiosError<ApiResponse>) => {
    openDialog({
      type: 'validate',
      text: error.response?.data.message ?? '서버에 오류가 발생했습니다.',
    });
  };

  const { mutateAsync: normalLogin, isLoading: isNormalLoginLoading } =
    useNormalLogin(() => {
      return false;
    }, handleLoginError);

  const { mutateAsync: socialLogin, isLoading: isSocialLoginLoading } =
    useSocialLogin(() => {
      return false;
    }, handleSocialLoginError);

  const isActive =
    !validateEmail(emailAddress) &&
    !validatePassword(password) &&
    emailAddress.length >= 1 &&
    password.length >= 1;

  const divergeAuthorizeFlow = (userName?: string) => {
    if (userName) {
      setIsLogin(true);
    } else {
      navigation.navigate('AgreeToTerm');
    }
  };

  const handleKakaoLogin = async () => {
    const kakaoResult = await loginWithKakaoAccount();
    const socialLoginResult = await socialLogin({
      socialType: 'kakao',
      token: kakaoResult.idToken,
    });
    divergeAuthorizeFlow(socialLoginResult.data?.userInfo.userName);
  };

  const handleCommonLogin = async () => {
    if (!isActive) return;
    const normalLoginResult = await normalLogin({
      email: emailAddress,
      password,
    });
    divergeAuthorizeFlow(normalLoginResult.data?.userInfo.userName);
  };

  useEffect(() => {
    resetToken();
    clearToken();
  }, []);

  if (isSocialLoginLoading || isNormalLoginLoading)
    return <CommonLoading isActive backgroundColor={colors.background} />;

  return (
    <View style={loginScreenStyles.container}>
      <Image
        style={loginScreenStyles.logo}
        source={require('../../../../assets/images/logo.png')}
      />
      <LoginInput
        label="이메일"
        value={emailAddress}
        type="emailAddress"
        validation={validateEmail}
        setValue={setEmailAddress}
      />
      <LoginInput
        label="비밀번호"
        value={password}
        type="password"
        setValue={setPassword}
        validation={validatePassword}
      />
      <LoginButton isActive={isActive} handlePress={handleCommonLogin} />
      <Text variant="caption" style={loginScreenStyles.middleText}>
        또는
      </Text>
      <SocialLoginButtonGroup
        kakaoLogin={handleKakaoLogin}
        naverLogin={() => {
          return false;
        }}
        googleLogin={() => {
          return false;
        }}
        appleLogin={() => {
          return false;
        }}
      />
      <View style={loginScreenStyles.joinAndFindContainer}>
        <JoinButton />
      </View>
    </View>
  );
};

export default LoginScreen;
