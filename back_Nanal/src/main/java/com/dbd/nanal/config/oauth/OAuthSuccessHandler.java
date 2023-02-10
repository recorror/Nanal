package com.dbd.nanal.config.oauth;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.dbd.nanal.config.common.ResponseMessage;
import com.dbd.nanal.config.security.JwtTokenProvider;
import com.dbd.nanal.config.security.JwtTokenDTO;
import com.dbd.nanal.config.security.JwtTokenRepository;
import com.dbd.nanal.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtTokenRepository jwtTokenRepository;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
        Authentication authentication) throws IOException, ServletException {
        JwtTokenProvider tokenProvider = new JwtTokenProvider(jwtTokenRepository, userRepository);
        ApplicationOAuth2User userPrincipal = (ApplicationOAuth2User) authentication.getPrincipal();
        OAuth2AccessToken oAuth2AccessToken = userPrincipal.getAccessToken();

        JwtTokenDTO jwtTokenDTO = tokenProvider.createJwtTokens(authentication);

        // 토큰

        int expTime = 10;

        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtTokenDTO.getRefreshToken());
        refreshTokenCookie.setMaxAge(expTime * 60);    // 초 단위
        refreshTokenCookie.setPath("/");     // 모든 경로에서 접근 가능

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("utf-8");

        response.addCookie(refreshTokenCookie);
        response.setStatus(200);
        response.addHeader("accessToken", jwtTokenDTO.getAccessToken());
        response.setHeader("kakaoAccessToken", oAuth2AccessToken.getTokenValue());

        HashMap<String, Object> responseDTO = new HashMap<>();
        responseDTO.put("statusCode", 200);
        HashMap<String, Object> data = new HashMap<>();
        data.put("responseMessage", ResponseMessage.LOGIN_SUCCESS);
        responseDTO.put("data", data);

        new ObjectMapper().writeValue(response.getWriter(), responseDTO);
        response.getWriter().flush();
    }
}