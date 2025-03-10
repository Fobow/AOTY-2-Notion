// ==UserScript==
// @name         AOTY Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @match        https://www.albumoftheyear.org/album/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=segmentfault.com
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';
    let score_box = $(".albumUserScoreBox");
    let add_btn = $("<button id='addnotionbtn' style='height: 100px; width: 100%; margin-top: 10px;'>add to notion</button>");
    score_box.after(add_btn);
    let default_cover = "https://is4-ssl.mzstatic.com/image/thumb/Music126/v4/a6/8b/65/a68b657c-cac6-68e6-3bde-b79d58fbc795/18UMGIM30762.rgb.jpg/1000x1000bb.jpg";
    let album_name = document.querySelector("#centerContent > div.fullWidth > div.albumHeadline > h1.albumTitle > span[itemprop='name']");
    let album_artist = document.querySelector("#centerContent > div.fullWidth > div.albumHeadline > div.artist > span[itemprop='byArtist'] > span[itemprop='name'] > a");
    let release_year = document.querySelector("#centerContent > div.fullWidth > div.albumTopBox.info > div:nth-child(2) > a:nth-child(2)");

    let album = new Object();
    album.name = album_name.textContent;
    album.artist = album_artist.textContent;
    album.release_date = getIsoDate();
    album.year = release_year.textContent;
    album.cover = "";
    add_btn.click(function(){
        let search_url = "https://itunesartwork.bendodson.com/api.php" + "?" +
        "query="+ album.name + " by " + album.artist +
        "&entity=" + "album" +
        "&country=" + "us" +
        "&type=" + "request";
        console.log("out");
        $.ajax({
            url: search_url,
            type: "GET",
            dataType:'json',
            success: function(result_1){
                    $.ajax({
                        url: result_1.url,
                        type: "POST",
                        dataType:'json',
                        success: function(result_2){
                            if(Number(result_2.resultCount) != 0){
                                let cover_url = result_2.results[0].artworkUrl100
                                album.cover = cover_url.replace("100x100bb","1000x1000bb");
                            }else{
                                let msg = "error@coverAPI, no search result! using default cover..."
                                alert(msg);
                                album.cover = default_cover;
                            }
                            addToNotion();
                        },
                        error: function(error){
                            let msg = "error@itune, cannnot find artwork! using default cover..."
                            alert(msg);
                            album.cover = default_cover;
                            addToNotion();
                        }
                    });
                },
            error: function(error){
                let msg = "error@coverAPI, no search result! using default cover..."
                alert(msg);
                album.cover = default_cover;
                addToNotion();
            }
        });
    })
    function getIsoDate(){
        let release_date_info = document.querySelector("#centerContent > div.fullWidth > div.albumTopBox.info > div:nth-child(2)").textContent;
        let release_reg = /([A-Z][a-z]+) ([0-9]+),  ([0-9]+) /;
        let release_date_raw = release_date_info.match(release_reg);
        let release_day = release_date_raw[2];
        let release_month_str = release_date_raw[1];
        let release_year = release_date_raw[3];
        let release_month = monthStr2Num(release_month_str);
        let release_date_str = release_year + "-" + release_month + "-" + release_day
        let release_date = new Date(+new Date(release_date_str)+8*3600*1000);
        return release_date.toISOString().split('T')[0];
    }
    function monthStr2Num(month){
        if(month == 'January') return 1
        if(month == 'February') return 2
        if(month == 'March') return 3
        if(month == 'April') return 4
        if(month == 'May') return 5
        if(month == 'June') return 6
        if(month == 'July') return 7
        if(month == 'August') return 8
        if(month == 'September') return 9
        if(month == 'October') return 10
        if(month == 'November') return 11
        if(month == 'December') return 12
    }
    function addToNotion() {
        let json_album = JSON.stringify(album);
        ```
        update your database id and base url here
        database id can be obtained from notion
        base url should be like this: https://woker.xxx.workers.dev/addAlbum
        ```
        let base_url = '' ;
        let database_id = '';
        let data_dict = {
            'parent':{
                "type": "database_id",
                'database_id': database_id
            },
            'properties':{
                'Name':{
                    'title':[
                        {
                            'text':{
                                'content': album.name
                            }
                        }
                    ]
                },
                'Artist':{
                    'rich_text': [
                        {
                            'type': 'text',
                            'text': {
                            'content': album.artist
                            },
                        }
                    ]
                },
                'Year':{
                    'number': Number(album.year),
                },
                'Release Date':{
                    "date": {
                        "start": album.release_date,
                    }
                }
            },
            'children': [],
            "cover": {
                "type": "external",
                "external": {"url": album.cover}
            }
        }
        let data_json = JSON.stringify(data_dict);
        $.ajax({
          url: base_url,
          type: "POST",
          data: data_json,
          dataType: 'json',
          contentType : "application/json",
          success: function(result){
              let msg = "success@notion, cover url: "+album.cover;
              alert(msg);
          },
          error: function(error){
              let msg = "error@notion, cover url: "+album.cover;
              alert(msg);
          }
      });
    }
})();