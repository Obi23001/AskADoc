package com.Medical.security.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import com.Medical.security.user.User; // Add this import

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

/**
 * This jwt Service is the service that will generate/decode/validate/extract the
 * information from the token
 */
@Service
public class JwtService {
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(),userDetails);
    }

    public String generateToken(HashMap<String,Object> claims,
                                 UserDetails userDetails){
        return buildToken(claims, userDetails,jwtExpiration);
    }

    private String buildToken(HashMap<String,Object> extraClaims,
                              UserDetails userDetails,
                              long jwtExpiration
                              ){
        var authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        
        // Add this line to get the full name
        String fullName = (userDetails instanceof User) ? ((User) userDetails).getFullName() : "";
        
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .claim("authorities", authorities)
                .claim("fullName", fullName)  // Add this line
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * A Method to check whether my token is valid or not
     */
    public boolean isTokenValid(String token,UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token,Claims::getExpiration);
    }

    /**
     * Extract the user from his token (knowing that every user have its specified token)
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);//[line 42].setSubject(userDetails.getUsername())
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
