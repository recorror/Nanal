package com.dbd.nanal.controller;


import com.dbd.nanal.config.common.DefaultRes;
import com.dbd.nanal.config.common.ResponseMessage;
import com.dbd.nanal.dto.FriendDetailResponseDTO;
import com.dbd.nanal.dto.UserResponseDTO;
import com.dbd.nanal.model.UserEntity;
import com.dbd.nanal.service.FriendService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Api(tags = {"Friend관련 API"})
@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("friend")
public class FriendController {

    private final FriendService friendService;

    @ApiOperation(value = "친구 등록", notes =
            "userIdx의 친구로 등록합니다.\n" +
                    "[Front] \n" +
                    "{friendIdx(int)} \n\n" +
                    "[Back] \n" +
                    "{} ")
    @PostMapping
    public ResponseEntity<?> saveFriend(@ApiParam(value = "사용자 id", required = true) @RequestBody HashMap<String, Integer> map, @ApiParam(value = "유저 idx", required = true) @AuthenticationPrincipal UserEntity userInfo) {

        HashMap<String, Object> responseDTO = new HashMap<>();
        map.put("userIdx", userInfo.getUserIdx());

        try {
            if (friendService.save(map)) {
                responseDTO.put("responseMessage", ResponseMessage.FRIEND_SAVE_SUCCESS);
                return new ResponseEntity<>(DefaultRes.res(200, responseDTO), HttpStatus.OK);
            } else {
                responseDTO.put("responseMessage", ResponseMessage.FRIEND_SAVE_FAIL);
                return new ResponseEntity<>(DefaultRes.res(500, responseDTO), HttpStatus.OK);
            }
        }
        catch (Exception e) {
            responseDTO.put("responseMessage", ResponseMessage.EXCEPTION);
            return new ResponseEntity<>(DefaultRes.res(500, responseDTO), HttpStatus.OK);
        }
    }

    @ApiOperation(value = "친구 프로필 조회", notes =
            "친구의 프로필을 조회합니다.\n" +
                    "[Front] \n" +
                    "{friendIdx(int)} \n\n" +
                    "[Back] \n" +
                    "friendList : [{userIdx(int), nickname(String), img(String), introduction(String)}, {..}] ")
//    @GetMapping
    @GetMapping("/{friendIdx}")
    public ResponseEntity<?> getFriend(@ApiParam(value = "친구 idx", required = true) @PathVariable("friendIdx") int friendIdx) {

        HashMap<String, Object> responseDTO = new HashMap<>();
        try {
            FriendDetailResponseDTO friend = friendService.findFriend(friendIdx);

            // 반환 성공
            if (friend != null) {
                responseDTO.put("responseMessage", ResponseMessage.FRIEND_FIND_SUCCESS);
                responseDTO.put("friend", friend);
                return new ResponseEntity<>(DefaultRes.res(200, responseDTO), HttpStatus.OK);
            } else {
                responseDTO.put("responseMessage", ResponseMessage.FRIEND_FIND_FAIL);
                return new ResponseEntity<>(DefaultRes.res(500, responseDTO), HttpStatus.OK);
            }
        }
        // Exception 발생
        catch (Exception e) {
            responseDTO.put("responseMessage", ResponseMessage.EXCEPTION);
            return new ResponseEntity<>(DefaultRes.res(500, responseDTO), HttpStatus.OK);
        }

    }
    @ApiOperation(value = "친구 리스트 조회", notes =
            "userIdx의 친구 리스트를 조회합니다.\n" +
                    "[Front] \n" +
                    "[Back] \n" +
                    "friendList : [{userIdx(int), nickname(String), img(String), introduction(String)}, {..}] ")
    @GetMapping("list")
//    public ResponseEntity<?> getFriendList(@ApiParam(value = "사용자 idx", required = true) @PathVariable int userIdx) {
    public ResponseEntity<?> getFriendList(@ApiParam(value = "유저 idx", required = true) @AuthenticationPrincipal UserEntity userInfo) {
        System.out.println("[친구 리스트] 유저 : idx " + userInfo.getUserIdx() + " name " + userInfo.getUsername());

        HashMap<String, Object> responseDTO = new HashMap<>();
        try {
            List<FriendDetailResponseDTO> friendList = friendService.findFriendList(userInfo.getUserIdx());
            // 반환 성공
            if (friendList.size() != 0) {
                responseDTO.put("responseMessage", ResponseMessage.FRIEND_LIST_FIND_SUCCESS);
                responseDTO.put("friendList", friendList);
                return new ResponseEntity<>(DefaultRes.res(200, responseDTO), HttpStatus.OK);
            } else {
                responseDTO.put("friendList", friendList);
                responseDTO.put("responseMessage", ResponseMessage.NONE_DATA);
                return new ResponseEntity<>(DefaultRes.res(200, responseDTO), HttpStatus.OK);
            }
        }
        // Exception 발생
        catch (Exception e) {
            responseDTO.put("responseMessage", ResponseMessage.EXCEPTION);
            return new ResponseEntity<>(DefaultRes.res(500, responseDTO), HttpStatus.OK);
        }

    }
    @ApiOperation(value = "이 그룹에 속하지 않는 친구 리스트 조회", notes =
            "user의 친구 리스트를 조회합니다.\n" +
                    "[Front] \n" +
                    "{groupIdx(int)} \n\n" +
                    "[Back] \n" +
                    "friendList : [{userIdx(int), nickname(String), img(String), introduction(String)}, {..}] ")
    @GetMapping("list/{groupIdx}")
    public ResponseEntity<?> getFriendListNotInGroup(@ApiParam(value = "그룹 idx", required = true) @PathVariable("groupIdx") int groupIdx, @ApiParam(value = "유저 idx", required = true) @AuthenticationPrincipal UserEntity userInfo) {

        HashMap<String, Object> responseDTO = new HashMap<>();
        try {
            List<HashMap<String, Object>> friendList = friendService.findFriendListNotInGroup(userInfo.getUserIdx(), groupIdx);
            // 반환 성공
            if (friendList.size() != 0) {
                responseDTO.put("responseMessage", ResponseMessage.FRIEND_LIST_FIND_SUCCESS);
                responseDTO.put("friendList", friendList);
                return new ResponseEntity<>(DefaultRes.res(200, responseDTO), HttpStatus.OK);
            } else {
                responseDTO.put("friendList", friendList);
                responseDTO.put("responseMessage", ResponseMessage.NONE_DATA);
                return new ResponseEntity<>(DefaultRes.res(200, responseDTO), HttpStatus.OK);
            }
        }
        // Exception 발생
        catch (Exception e) {
            responseDTO.put("responseMessage", ResponseMessage.EXCEPTION);
            return new ResponseEntity<>(DefaultRes.res(500, responseDTO), HttpStatus.OK);
        }

    }




}