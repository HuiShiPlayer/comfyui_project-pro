package com.zyz.util;

import com.zyz.common.CheckResult;
import com.zyz.common.MyConst;
import io.jsonwebtoken.*;
import org.apache.commons.codec.binary.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;

public class JwtUtils {
	/**
	 * 签发JWT
	 * 
	 * @param id
	 * @param
	 * @param ttlMillis
	 * @return String
	 *
	 */
	public static String createJWT(String id, String userInfo, Long ttlMillis) {
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
		long nowMillis = System.currentTimeMillis();
		Date now = new Date(nowMillis);
		SecretKey secretKey = generalKey();
		JwtBuilder builder = Jwts.builder().setId(id).setSubject(userInfo) // 主题
				.setIssuer(MyConst.ENTERPRISE) // 签发者
				.setIssuedAt(now) // 签发时间
				.signWith(signatureAlgorithm, secretKey); // 签名算法以及密匙
		if (ttlMillis >= 0) {
			long expMillis = nowMillis + ttlMillis;
			Date expDate = new Date(expMillis);
			builder.setExpiration(expDate); // 过期时间
		}
		return builder.compact();
	}

	/**
	 * 验证JWT
	 * 
	 * @param jwtStr
	 * @return
	 */
	public static CheckResult validateJWT(String jwtStr) {
		CheckResult checkResult = new CheckResult();
		Claims claims = null;
		try {
			claims = parseJWT(jwtStr);
			checkResult.setSuccess(true);
			checkResult.setClaims(claims);
		} catch (ExpiredJwtException e) {
			checkResult.setErrCode(MyConst.JWT_ERRCODE_EXPIRE);
			checkResult.setSuccess(false);
		} catch (SignatureException e) {
			checkResult.setErrCode(MyConst.JWT_ERRCODE_FAIL);
			checkResult.setSuccess(false);
		} catch (Exception e) {
			checkResult.setErrCode(MyConst.JWT_ERRCODE_FAIL);
			checkResult.setSuccess(false);
		}
		return checkResult;
	}

	public static SecretKey generalKey() {
		byte[] encodedKey = Base64.decodeBase64(MyConst.JWT_SECERT);
		SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
		return key;
	}

	/**
	 * 
	 * 解析JWT字符串
	 * 
	 * @param jwt
	 * @return
	 * @throws Exception
	 */
	public static Claims parseJWT(String jwt) throws Exception {
		SecretKey secretKey = generalKey();
		return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwt).getBody();
	}

//	public static void main(String[] args) throws InterruptedException {
//		String createJWT1 = createJWT("001", "7theaven", 20000L);
//		System.out.println(createJWT1);
//		Thread.sleep(1000);
//		CheckResult validateJWT = validateJWT(createJWT1);
//		System.out.println(validateJWT);
//	}
}