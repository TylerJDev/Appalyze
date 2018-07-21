/** To do -
Add possibly background graph
Add something nice for whomever gets the initial #1 spot on the total message count
Add 'exampe' file
**/
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import Button from '@material-ui/core/Button';
import Indigo from '@material-ui/core/colors/indigo';
import Grey from '@material-ui/core/colors/grey';
import { Security, Comment, MoreVert, Search, TagFaces, PhotoCamera, Mic, Phone } from '@material-ui/icons';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import phone_img from './messages.svg';
import 'fullpage.js'
import Chart from 'chart.js';
import ScrollReveal from 'scrollreveal'
import $ from "jquery";
import camera from './camera.svg'
import camera_flash from './camera_flash.svg'
import speech from './speech.svg'
import time from './time.svg'
import words from './words.svg'
import demo from './demo.json'
var analyze = require('./analyze.js')
var analyzeActive = false // True if analyze has already been called

const primary = Indigo[900];
const secondary = Grey[600];
var mainFile = ''; // This holds the whatsapp txt file
var mainData = false; // Holds the data from analyze.jsscrollreveal
var n_history = '';
const boxesCount = [
  ['Jin', 'Who is this "Samurai who smells of Sunflowers"?', '6:02 PM'],
  ['Tyler', 'New phone who dis?', '1:23 PM'],
  ['Jack', 'AKU!!!', '3:21 AM'],
  ['Hank', 'I sell propane and propane accessories', '10:12 AM'],
  ['Michael', "Fool me once, strike one. Fool me twice... strike three.", '3:21 PM']
];

const wa_chats = [
  [
    ['Uh, listen Jet. You said "Bell Peppers and Beef." There\'s no beef in here... So you wouldn\'t really call it "Bell Peppers and Beef," now would you?', '1:24 AM'],
    ['Yes, I would.', '1:24 AM'],
    ['WELL IT\'S NOT!', '1:25 AM'],
    ['It is when you\'re broke...', '1:25 AM']
  ],

  [
    ['No no no, look, it means go up to the right, bare right, over the bridge and hook up with 307.', '2:02 PM'],
    ["Maybe it's a shortcut Dwight. It said go to the right.", '2:04 PM'],
    ["It can't mean that! There's a lake there!", '2:04 PM'],
    ["The machine knows where it is going!", '2:04 PM']
  ]
]

const wa_boxes = boxesCount.map((box, i) =>
  <div className="wa_user_box">
    <div className="wa_image_box">
    </div>
    <div className="wa_name">
      <h4>{box[0]}</h4>
      <p>{box[1].substring(0, 15)}...</p>
    </div>
    <h4 className="wa_time">{box[2]}</h4>
  </div>
);

const return_wa_class = (x) => {return x % 2 ? "wa_left" : "wa_right"}

const wa_chat_rand = wa_chats[Math.floor(Math.random() * 2)].map((chats, i) =>
  <div className={'wa_message_box ' + return_wa_class(i)}>
    <p>{chats[0]} <small>{chats[1]}</small></p>
  </div>
);

const handleChange = function(history) {
  const txtInput = document.querySelector('#txtInput');
  var newFile = txtInput.files[0]; // Get the file that was passed
  var fileType = newFile.type
  if (fileType.match('text/plain')) {
    var nReader = new FileReader();
    nReader.onload = function(e) {
      mainFile = nReader.result // text file inputted by user to parsable format
      mainData = analyze.analyze(mainFile); // Pass mainFile to analyze.js
      if (mainData === 'no_support') {
        document.querySelector('#file_support_text').style.display = 'block';
        return false;
      }

      analyzeActive = true;
      $('#wa_modal_main').modal('toggle') // Hides the modal, as it will 'stick' if it's not toggled
      $.fn.fullpage.destroy('all'); // Destroy all fullpage changes


      if (n_history === '') {
        n_history = history;
      } else {
        $('body').scrollTop();
        history.push('/');
        return history.push('/result');


      }
      return history.push('/result')
    }
    nReader.readAsText(newFile); // This activates the onload above
  } else {
    alert('File not supported') // Placeholder
  }
}

function demoVer(history) {
  analyzeActive = true;
  $.fn.fullpage.destroy('all'); // Destroy all fullpage changes
  mainData = demo;
  return history.push('/result');
}

function defaultCSS() {
    document.querySelector('#wa_phone').style.backgroundColor = "#ffffff";
    document.querySelector("#wa_phone_nav_s").style.display = 'flex';
    $('.wa_user_box').css('display', 'flex');
    $('#wa_phone_nav_m').find('h3').text('App');
    $('.message_screen').css('display',' none');
    $('.contact_screen').css('display', 'inline-block');
    $('#wa_chat_messages').css('display', 'none');
    $('#chat_box_con').css('display', 'none');
    $('#dropdown_wa').css('display', 'none');
    $('#wa_phone_overlay').css('display', 'none');
    $('#modal_wa').css('display', 'none')
    $('#wa_phone_nav_s').css('margin-bottom', '0px');
}

function Modal(props) {
  return (
    <div className="modal fade" id="wa_modal_main" tabIndex="-1" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-body container-fluid">
            <div id="modal-row" className="row">
              <div id="modal_left" className="col-md-5">
                <div id="wa_phone">
                  <div id='wa_phone_overlay'>
                  </div>
                  <div id="wa_phone_nav_m">
                    <h3>App</h3>
                    <div id="wa_icons_nav">
                      <Phone className="icon_list_nav message_screen" style={{fontSize: '20px', display: 'none'}}/>
                      <PhotoCamera className="icon_list_nav message_screen" style={{fontSize: '20px', display: 'none'}}/>


                      <Search className="icon_list_nav contact_screen" style={{fontSize: '20px'}}/>
                      <Comment className="icon_list_nav contact_screen" style={{fontSize: '20px'}}/>
                      <MoreVert className="icon_list_nav" style={{fontSize: '20px'}}/>
                    </div>
                  </div>
                  <div id="wa_phone_nav_s">
                    <h4>CALLS</h4>
                    <h4>CHATS</h4>
                    <h4>CONTACTS</h4>
                  </div>
                  <div id="dropdown_wa">
                    <p>Block</p>
                    <p>Clear Chat</p>
                    <p className="selected_item_wa">Export Chat</p>
                    <p>Add shortcut</p>
                  </div>
                  {wa_boxes}
                  <div id="modal_wa">
                    <p>Including media will increase the size of the chat export.</p>
                    <div id="modal_wa_buttons">
                      <button className="selected_item_wa">WITHOUT MEDIA</button>
                      <button>INCLUDE MEDIA</button>
                    </div>
                  </div>
                  <div id="wa_chat_box">
                    <div id="wa_chat_messages">
                      {wa_chat_rand}
                    </div>

                    <div id="chat_box_con">
                      <div id="chat_box">
                        <TagFaces className="icon_list_nav icon_wa" style={{fontSize: '20px', color: '#777'}}/>
                        <p>Type a message</p>
                        <PhotoCamera className="icon_list_nav icon_wa" style={{fontSize: '20px', color: '#777'}}/>
                      </div>

                      <Mic className="icon_list_nav icon_mic" style={{fontSize: '20px', color: '#777'}}/>
                    </div>
                  </div>
                </div>
              </div>
              <div id="modal_right" className="col-md-7">
                <h4>UPLOAD YOUR<br/> WhatsApp CHAT</h4>
                <div id="modal_text_div">
                  <p style={{fontSize: '0.9rem'}}>{"It's simple! To upload your WhatsApp chat follow these steps."}</p>
                  <ol>
                    <li id="list_modal_0">Go to the chat you want to export and click the three dots in the corner <MoreVert/></li>
                    <li id="list_modal_1">Tap 'Email Chat' and continue <span style={{backgroundColor: 'yellow', fontStyle: 'italic'}}>(without media)</span></li>
                    <li id="list_modal_2">Email yourself the chat then upload that chat below by clicking 'Upload File'</li>
                  </ol>

                  <div id="modal_form">
                    <p id="file_support_text" style={{color: 'red', textAlign: 'center', display: 'none'}}>{`Error, File isn't supported!`}</p>
                    <label htmlFor="txtInput" id="file_upload" className="file_upload_btn" style={{backgroundColor: primary}}>Upload File</label>
                    <input type="file" id="txtInput" variant="contained" onChange={() => handleChange(props.data)}>
                    </input>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* For phone modal display */

function modal_wa_screen_1 () {
  document.querySelector('#wa_phone').style.backgroundColor = "#95d4e3";
  document.querySelector("#wa_phone_nav_s").style.display = 'none';
  $('.wa_user_box').css('display', 'none');
  $('#wa_phone').addClass('wa_phone_message');
  $('#wa_phone_nav_m').find('h3').text('Chat');
  $('.message_screen').css('display',' inline-block');
  $('.contact_screen').css('display', 'none');
  $('#wa_chat_messages').css('display', 'block');
  $('#chat_box_con').css('display', 'flex');
}

function modal_wa_screen_2 () {
  $('#dropdown_wa').css('display', 'block');
}

function modal_wa_screen_3 () {
  $('#wa_phone_overlay').css('display', 'block');
  $('#modal_wa').css('display', 'block');
}

$('#root').on('mouseover click focus', '#list_modal_0', function() {
  modal_wa_screen_1();
}).mouseout(defaultCSS);

$('#root').on('mouseover click focus', '#list_modal_1', function() {
  modal_wa_screen_1();
  modal_wa_screen_2();
}).mouseout(defaultCSS);

$('#root').on('mouseover click focus', '#list_modal_2', function() {
  modal_wa_screen_1();
  modal_wa_screen_2();
  modal_wa_screen_3();
}).mouseout(defaultCSS);

const Home = ({history}) => (
  <div className="App">
    <div id="fullpage">
      <div className="section container-fluid">
        <div className="row">
          <div id="side_1" className="jumbo-sides col-md-6 jumbo-section justify-content-center align-items-center">
            <div id="jumbo-section">
              <h1 id="header-text">Find out <span className="sp_text">more</span> about<br/> your WhatsApp Chat!</h1>
              <p>Your data is safe! All data is is processed on the front-end, meaning it will only be available to you!</p>
              <div className="info_type">
                <ul>
                  <li><Security className="icon_list_type" style={{fontSize: '40px'}}/><span className="list_text">No data uploaded to any server, always available offline!</span></li>
                  <li><Comment className="icon_list_type" style={{fontSize: '40px'}}/><span className="list_text">Analyzes thousands of messages in seconds</span></li>
                </ul>
              </div>
              <Button id="ctaBtn" className="home_btn" size="large" variant="contained" color="primary" data-toggle="modal" data-target="#wa_modal_main" style={{backgroundColor: primary}}>
                Get Started!
              </Button>

              <Button id="dmoBtn" className="home_btn" size="medium" variant="contained" color="secondary" style={{backgroundColor: secondary}} onClick={() => demoVer(history)}>
                See Demo
              </Button>

              <p style={{color: '#9E9E9E', fontStyle: 'italic', fontSize: '0.7rem', textAlign: 'center'}}>WhatsApp is a registered trademark of WhatsApp Inc. This site and service are not related in any way to WhatsApp Inc.</p>
            </div>
          </div>
          <div id="side_2" className="jumbo-sides container col-md-6">
            <div id="slide_2_bg" className="row">
              <div id="side_2_col" className="col">
                <img id="phone_example" src={phone_img} height="600" width="328" alt="Phone With app Displayed"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal data={history}/>
  </div>
)

const Result = function() {

  if (analyzeActive === false) {
    window.location.replace(window.location.origin)
  }

  // Hides the 'Top x words' banner when you scroll down past 300 in height
  window.addEventListener('scroll', function(e) {
    if (window.scrollY > 250) {
      $('.mh').fadeOut('slow');
    } else {
      $('.mh').fadeIn('slow');
    }
  });

  // Gets top 100 words from analyze.js and reverses the order (because the order received is opposite i.e, #1 is least, #100 is most)

  function wordListFunc(count=100, font_size=12) {
    const mainDataArr = mainData.mostWords.slice(0, count).reverse();
    // Put top words in a list, increase font size by 0.75 each list element
    const wordsList = mainDataArr.map((word, i) =>
      <li className="list_word_type" style={{ fontSize: font_size + (i - 0.75)}}><span className="word_number">#{mainDataArr.length - i}</span> <button className="list_word_btn" type="button">{word[0]}</button><span className="word_number">  -  Times Used: {word[1]}</span></li>
    );

    return [wordsList, mainDataArr];
  }

  var listData = wordListFunc();

  const topWords = listData[0];
  const mainDataArr = listData[1];

  // Hover over a list element to display a div with stats for that list element's text content
  function rootMouseover(mDataArr) {
    $('#root').on('mouseover click focus', '.list_word_type', function() {
      $('#type_box').css('display', 'block');
      $('#root').find('#word_type_header').text($(this).find('.list_word_btn').text());
      $('#root').find('#ranking').text($('.list_word_type').length - $(this).index());
      $('#root').find('#count_word').text(mDataArr[$(this).index()][1]); // This may cause an error randomly..
      $(this).closest('div').find('.fixed_s_type').css('display', 'block');
    }).mouseout(function() {
      $('#type_box').css('display', 'none');
    });
  }

  rootMouseover(mainDataArr);

  var rootNode = document.getElementById('root');
  var config = {childList: true, subtree: true };
  var count = 0;
  var active = false;
  var totalCounts = [
    [],
    []
  ]; // Counts of both user messages total
  var winnerActive = false;
  const to_num = (x) => {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")};
  var callback = function(mutationsList) { // This is to check when the 'sections' are rendered in the DOM
    for(var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (count === 0) {
              ScrollReveal().reveal('.s_r', { duration: 500, reset: true, beforeReveal: function (domEl) {
                const s_con  = document.querySelector('#section_container');
                for (var findChildren of s_con.children) {
                  if (findChildren.attributes.id.value !== domEl.attributes.id.value) {
                    $(`#${findChildren.attributes.id.value}`).find('.fixed_s_type').css('display', 'none');
                  }
                }

                /* Start typewriter effect */
                const dateWriter = document.querySelector('#mh_type_date');
                const dateTypes = Object.keys(mainData.timeSince)
                var currentDates = ['Months']; // Months due to this is the default start preset
                function removeType(a) {
                  if (a !== true) {
                    active = true;
                    var typeRemove = setInterval(function() {
                      dateWriter.textContent = dateWriter.textContent.slice(0, (dateWriter.textContent.length - 1));
                      if (dateWriter.textContent.length === 0) {
                        clearInterval(typeRemove);
                        // Get a random 'datetype'
                        if (currentDates.length >= dateTypes.length) {
                            currentDates = [];
                        }

                        var gRand = function() {
                          var dType = dateTypes[Math.floor(Math.random() * dateTypes.length)];
                          if (currentDates.indexOf(dType) >= 0) {
                            return gRand();
                          } else {
                            currentDates.push(dType);
                            return dType
                          }
                        }
                        startType(gRand());
                      }
                    }, 150);
                  }
                }

                function startType(type) {
                  var nCount = 0;
                  var m_type = to_num(mainData.timeSince[type]) + ` ${type.toUpperCase()}`;
                  var typeAdd = setInterval(function() {
                    dateWriter.textContent += m_type[nCount];
                    nCount += 1;
                    if (dateWriter.textContent.length === m_type.length) {
                      clearInterval(typeAdd);
                      setTimeout(() => { removeType(false); }, 2500);
                    }
                  }, 150)
                }
                setTimeout(() => { removeType(active); }, 2500);
                ScrollReveal().reveal('#s_3', { duration: 1000, reset: false, beforeReveal: function (dEl) {

                  $('.message_total_side').animate({
                     height: '100%'
                  }, 2000);

                  // This commented line breaks the next scrollreveal unfortunately...
                  // ScrollReveal().reveal('.message_total_con', {duration: 4000});
                  $('#versus_div').fadeIn('slow');
                  var currentUsers = Object.keys(mainData.usersMessagesTotal)
                  // Get the names with the most message count
                  var topUsers = [];
                  for (var x = 0; x < currentUsers.length; x++) {
                    topUsers.push([currentUsers[x], mainData.usersMessagesTotal[currentUsers[x]].length])
                  }

                  topUsers.sort((a, b) => b[1] - a[1]);

                  for (var y = 0; y < 2; y++) {
                    document.querySelectorAll('.user_type_total')[y].innerHTML = topUsers[y][0].split('').map(x => '<span>' + x + '</span>').join('');;
                    document.querySelectorAll('.versus_text')[y].innerHTML = topUsers[y][0].split('').map(x => '<span>' + x + '</span>').join('');
                    countTotalWords(document.querySelectorAll('.user_type_total_count')[y], topUsers[y][1]);
                    nextUp(y)
                  }

                  function nextUp(count) {
                    const r_reduce = (x, y) => x + y;
                    var months = mainData.average.average_month[0];
                    countTotalWords(document.querySelectorAll('.stats_word_count')[count], Object.values(mainData.usersWordsTotal[topUsers[count][0]]).reduce(r_reduce));
                    document.querySelectorAll('.stats_favorite_word')[count].textContent = mainData.topWordsEach[topUsers[count][0]][0];
                    document.querySelectorAll('.stats_most_active')[count].textContent = months[Object.values(mainData.average.average_per[topUsers[count][0]]['Months']).indexOf(Math.max(...Object.values(mainData.average.average_per[topUsers[count][0]]['Months'])))];
                  }

                  function countTotalWords(element, count, call=false) {
                    var count_r = '';
                    try { // If for some reason, the element 'disappears'
                      if (['user_type_total_count', 'stats_word_count'].indexOf(element.className) >= 0) {
                        totalCounts[0].push(count);
                        totalCounts[1].push(element);
                      };
                    } catch(error) {
                      return false;
                    }

                    $(element).animate({
                      totalCount: count
                    }, {
                      duration: 5000,
                      step: function() {
                        $(this).text(to_num(Math.floor(this.totalCount)));

                          if (call[0] === 'rank') {
                            if (count_r === '') {
                              count_r = Object.keys(call[1]).length - 1;
                            }
                            if (count_r >= 0) {
                              if (this.totalCount > call[1][Object.keys(call[1])[count_r]].count_ranking) {
                              // add class to that rank box

                              document.querySelectorAll('.ranking_box')[count_r].style.border = '2px solid black';
                              document.querySelectorAll('.ranking_box')[count_r].style.borderBottom = 'none !important;'
                              if (count_r !== (Object.keys(call[1]).length - 1)) {
                                document.querySelectorAll('.ranking_box')[count_r + 1].style.border = 'none';
                              }

                              count_r--;
                            }
                          }
                        }
                      }, complete: function() {
                        $(this).text(to_num(Math.floor(this.totalCount))); // Gives the element the last few integers
                        if (['user_type_total_count', 'stats_word_count'].indexOf(element.className) >= 0 && winnerActive !== true) {
                          winnerActive = true;
                          var contestArr = [];
                          for (var mWinner = 0; mWinner < (Math.floor(totalCounts[0].length) / 2); mWinner++) {
                            var contest = [totalCounts[0][mWinner], totalCounts[0][mWinner + 2]];
                            var winner = totalCounts[0].indexOf(Math.max(...contest));
                            var loser = totalCounts[0].indexOf(Math.min(...contest));
                            contestArr.push([Math.max(...contest), Math.min(...contest)]);
                            totalCounts[1][winner].style.color = '#33691E';
                            totalCounts[1][loser].style.color = '#B71C1C';
                          }


                          getWinner(totalCounts);
                        }

                        if (call !== false && call[0] !== 'rank') {
                          var winnerUser = [document.querySelectorAll('.versus_text'), document.querySelectorAll('.user_type_total')];
                          document.querySelectorAll('.winner_header')[call].style.visibility = 'visible';
                          for (var i of winnerUser) {
                            if (i[call] !== undefined) {
                              rainbowWords(i[call]);
                            }
                          };

                          function rainbowWords(word) {
                            var colors = ['#E91E63', '#F44336', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
                            var wordList = word.children;
                            var count = 0;
                            var childCount = 0;
                            setInterval(function() {
                              wordList[childCount].style.color = colors[count];
                              if (count >= colors.length - 1) {
                                count = 0;
                              } else {
                                count++;
                              }

                              if (childCount >= wordList.length - 1) {
                                childCount = 0;
                              } else {
                                childCount++;
                              }
                            }, 100)

                          }


                        }
                      }
                    });
                  }

                  function getWinner(points) {
                    const r_reduce = (x, y) => x + y; // reduce the amount of times this is used!
                    var pointsTotal = [];
                    var pointsTotalElements = [];
                    var pointsPer = [[], []];
                    for (var x = 0; x < points.length; x++) {
                      var pointsArr = [];
                      var pointsArrEle = [];
                      pointsPer[0].push(points[0].splice(0, 2))
                      pointsPer[1].push(points[1].splice(0, 2))
                      for (var z = 0; z < pointsPer[0][x].length; z++) {
                        if (z === 1) {
                          pointsArr.push(pointsPer[0][x][z] / 5);
                        } else {
                          pointsArr.push(pointsPer[0][x][z]);
                        }
                        pointsArrEle.push(pointsPer[1][x][z]);
                      }
                      pointsTotal.push(pointsArr);
                      pointsTotalElements.push(pointsArrEle);
                    }

                    var totalAmount = [];
                    for (var reduceCount = 0; reduceCount < pointsTotal.length; reduceCount++) {
                      totalAmount.push(pointsTotal[reduceCount].reduce(r_reduce));
                    }

                    var winner = totalAmount.indexOf(Math.max(...totalAmount));

                    for (var countWinScore = 0; countWinScore < pointsTotal.length; countWinScore++) {
                      countTotalWords(document.querySelectorAll('.versus_points')[countWinScore], Math.floor(pointsTotal[countWinScore].reduce(r_reduce)), winner);
                    }
                  };

                  ScrollReveal().reveal('#s_4', { duration: 2000, reset: false, beforeReveal: function (dEl) {
                    setTimeout(function() {
                      $('.camera_man').fadeOut('fast', function() {
                          $('.camera_man').attr('src', camera_flash);
                          $('.camera_man').fadeIn('fast');

                          setTimeout(function() {
                            countTotalWords(document.querySelector('#SURPRISE-YOU'), mainData.mediaCount)
                            $('#surprise_sub_header').fadeIn('fast');
                          }, 1500)
                      });
                    }, 1500)


                    ScrollReveal().reveal('#s_5', { duration: 2000, reset: false, beforeReveal: function (dEl) {

                      /*** What the chart should do
                      - Display chat frequency over days/months/years
                      - Show average of tweets for days/months/years (possibly bar chart)
                      ***/

                      var ctx = document.querySelector("#chart_of");
                      var myChart = new Chart(ctx, {
                          type: 'line',
                          data: {},
                          options: {
                            scales: {
                              xAxes: [{
                                gridLines: {
                                  display:false
                                }
                              }],
                              yAxes: [{
                                gridLines: {
                                  display:false
                                }
                              }]
                            }
                          }
                      });
                      /* End */

                      function getDataChart(dataType, type) {
                        var dataFor = {
                          labels: [],
                          datasets: [{
                            label: '',
                            data: [],
                            fill: false,
                            borderColor: '#000000',
                            borderWidth: 1
                          }]
                        }


                        dataFor.datasets[0].label = 'Total messages ' + type;
                        if (type === 'daily') {
                          var dataDates = [];
                          for (var x of Object.keys(dataType)) {
                            dataDates.push(new Date(x).getTime())
                          }

                          dataDates.sort((a, b) => a - b);

                          function sortDates(date) {
                            var o = new Date(date);
                            var m = `${(o.getMonth() + 1)}/${o.getUTCDate()}/${o.getUTCFullYear().toString().substring(2, 4)}`
                            return m;
                          }

                          for (var z of dataDates) {
                            var mainDate = sortDates(new Date(z));
                            dataFor.labels.push(mainDate)
                            dataFor.datasets[0].data.push(dataType[mainDate])
                          }
                        } else if (type === 'monthly') {
                          for (var grabMonths of Object.keys(dataType[1])) {
                            dataFor.labels.push(dataType[0][grabMonths.split('_')[0]] + ` ${grabMonths.split('_')[1]}`);
                            dataFor.datasets[0].data.push(dataType[1][grabMonths])
                          }
                        } else if (type === 'yearly' || type === 'weekly') {
                          for (var grabYears of Object.keys(dataType)) {
                            dataFor.labels.push(grabYears);
                            dataFor.datasets[0].data.push(dataType[grabYears]);
                          }
                        }
                        myChart.data = dataFor;
                        myChart.update();
                      }

                      getDataChart(mainData.average.average_day, 'daily');

                      const avgType = {
                        'daily': 'average_day',
                        'weekly': 'average_week',
                        'monthly': 'average_month',
                        'yearly': 'average_year'
                      }

                      $('.c_tab').click(function() {
                        var clickedElement = $(this); // The tab that was clicked
                        var selectElement = '' // Holds a copy of the 'selected_tab' to append back to the list
                        if ($(this).attr('class') !== 'selected_tab') {
                          selectElement = $('.selected_tab');
                          selectElement.removeClass('selected_tab');

                          var oldTab = $('.c_tab').eq($('.c_tab').length - 1);
                          oldTab.removeClass('selected_tab');

                          clickedElement.addClass('selected_tab');
                          getDataChart(mainData.average[avgType[clickedElement.attr('id')]], clickedElement.attr('id'));
                        }
                      });



                      ScrollReveal().reveal('#s_6', { duration: 2000, reset: false, beforeReveal: function (dEl) {
                        const totalMessages = document.querySelector('#total_score');
                        const oldScoreContainer = document.querySelector('#checked_scores')
                        const rankings = {
                          'Ride Together, Die Together': {
                            'count_ranking': 65000,
                            'descr': ['We ride together, we die together. Bad for life.'],
                          },

                          'Best Friends Forever And Beyond': {
                            'count_ranking': 50000,
                            'descr': ['Best friends for a really really long time... And beyond!'],
                          },

                          'Comrades': {
                            'count_ranking': 35000,
                            'descr': ['Better than just best friends.. Comrades!']
                          },

                          'Best Friends ': {
                            'count_ranking': 20000,
                            'descr': ['If you thought being just friends was cool.. Wait til you reach this level.']
                          },

                          'Friends ': {
                            'count_ranking': 10000,
                            'descr': ['F is for friends who do stuff together!']
                          },

                          'Acquaintances ': {
                            'count_ranking': 1000,
                            'descr': ['Pleased to make your acquaintance... Acquaintance!']
                          },

                          'Strangers': {
                            'count_ranking': 100,
                            'descr': ['There are stranger things than just being a stranger.']
                          }
                        }

                        var rankingContainer = document.querySelector('#ranking_con');

                        for (var createRankingBox = 0; createRankingBox < Object.keys(rankings).length; createRankingBox++) {
                          var rankingBox = document.querySelector('#ranking_box_hold').cloneNode(); // Grab the original and clone to
                          rankingContainer.appendChild(rankingBox);
                          rankingContainer.children[createRankingBox + 1].innerHTML = `<h4>${Object.keys(rankings)[createRankingBox]}</h4>
                          <h6>${rankings[Object.keys(rankings)[createRankingBox]].count_ranking} Points</h6>
                          <p>${rankings[Object.keys(rankings)[createRankingBox]].descr}</p>` // + 1 to ignore the 'copy' element
                        }

                        // Remove the first copy
                        $('#ranking_box_hold').remove();

                        const scoreTypes = {
                          'duration': [mainData.timeSince.Days, mainData.timeSince.Days * 5], // Score will be only counting days x5
                          'wordCount': [mainData.wordCount, mainData.wordCount / 5], // Wordcount / 5
                          'media_Count': [mainData.mediaCount, mainData.mediaCount * 10], // Mediacount * 10
                          'total_messages': [mainData.userMessagesTotal, mainData.userMessagesTotal]
                        }

                        var heldElements = [];

                        totalMessages.textContent = mainData.userMessagesTotal;

                        detractScore(totalMessages, mainData.userMessagesTotal)
                        function detractScore(element, count) {
                          const n_reduce = (x, y) => x + y;
                          element.totalCount = count;
                          var activeCount = false;

                          $(element).animate({
                            totalCount: '-=' + count
                          }, {
                            duration: 5000,
                            step: function() {
                              $(this).text(to_num(Math.floor(this.totalCount)));
                              if (activeCount === false) {
                                countTotalWords($('#' + $('.picked_score_header').attr('id') + '_score'), scoreTypes[$('.picked_score_header').attr('id')][1])
                                heldElements.push(scoreTypes[$('.picked_score_header').attr('id')][1]);
                                activeCount = true;
                              }

                            }, complete: function() {
                              $(this).text(to_num(Math.floor(this.totalCount))); // Gives the element the last few integers
                              $('.picked_score_header').appendTo(oldScoreContainer).removeClass('picked_score_header');
                              var countBoxHeader = $('#counting_box').children('h6').eq($('#counting_box').children('h6').length - 1);
                              countBoxHeader.addClass('picked_score_header');

                              if ($('#counting_box').children('h6').length === 0) {
                                // if points are done 'counting'
                                countTotalWords(document.querySelector('#total_score'), heldElements.reduce(n_reduce), ['rank', rankings]);
                                $('#checked_scores').fadeOut('slow');
                                $('#point_collect_header').fadeIn('slow');

                                // Get the scores ranking
                                for (var getScoreRank = 0; getScoreRank < Object.keys(rankings).length; getScoreRank++) {
                                  if (heldElements.reduce(n_reduce) > rankings[Object.keys(rankings)[getScoreRank]].count_ranking && document.querySelector('#score_ranking_header') !== null) {
                                    document.querySelector('#score_ranking_header').textContent = Object.keys(rankings)[getScoreRank];
                                    document.querySelector('#score_ranking_para').innerHTML =  rankings[Object.keys(rankings)[getScoreRank]].descr[0] // Put this at random
                                    break;
                                  }
                                }

                                return false;
                              } else {
                                return detractScore(totalMessages, scoreTypes[countBoxHeader.attr('id')][0])
                              }
                            }
                          });
                        }
                      }});
                    }});
                  }});
                }})
              }})
            }
            count++;
        }
    }
  };


  const compareCount = function() {
    const countWords_obj = {
      randomFacts: {
        "You wrote more words than there are in 'Harry Potter and the Sorcerer’s Stones'!": 76944,
        "Is it hot in here? There's more words here from your chat than in 'Fahrenheit 451'! 🔥": 46118,
        "An epic tale in lands far away.. Or on your phone..! You've wrote more words than 'A Game Of Thrones'! ⚔️": 298000,
        "IT'S OVER 9000!!": 9001,
        'NANI!?': 0
      }
    }

    return countWords_obj;
  }

  const getWordFacts = function(tNum) { // This function will get a 'fact' grabbing whichever fact is closest to the total message count
    const randomFactsVals = Object.values(compareCount().randomFacts); // Gets the 'fact count' from the compareCount function
    const getClose = randomFactsVals.filter(randomFactsVals => randomFactsVals < tNum); // Find the closest number based on 'fact count' and 'message count'
    getClose.map(getClose => tNum - getClose);
    const minNumMatch = Math.min(...getClose.map(getClose => tNum - getClose));
    return Object.keys(compareCount().randomFacts)[randomFactsVals.indexOf(tNum - minNumMatch)]
  }

  var observer = new MutationObserver(callback);
  observer.observe(rootNode, config);

  // e = target element, if disable === true, reset header/cover_div/body css back to initial state
  function handleCount(e, disable=false) {
    const countArr = [10, 25, 50, 100, 200, 300];
    const el = document.querySelector('#header_count_div');
    const inactiveEl = document.querySelectorAll('.n_active');
    const countNum = document.querySelector('#count_of');
    const prevCount = document.querySelector('#prev_count')
    const nextCount = document.querySelector('#next_count')

    if (e !== null) {
      if ([...e.target.classList].includes('n_active') || [...e.target.classList].includes('click_span')) {
        var clickedNum = '';
        var fontSize = '';

        if ([...e.target.classList].includes('click_span')) {
          clickedNum = parseInt(e.target.textContent);
        } else {
          clickedNum = parseInt(e.target.children[0].textContent);
        }

        if (clickedNum < 50) {
          fontSize = 24;
        } else {
          fontSize = 12;
        }

        var wordListData = wordListFunc(clickedNum, fontSize);
        // Remove mouseover event, and recreate a new event
        $('#root').off('mouseover', '.list_word_type');
        rootMouseover(wordListData[1]);

        ReactDOM.render(wordListData[0], document.getElementById('top_words_list'));

        var countNext = countArr.indexOf(clickedNum) - 1;
        var countPrev = countArr.indexOf(clickedNum) + 1;


        // If the count has reached the end of array, reset from the back of that array, or reset from the front
        if (countNext === -1) {
          countNext = countArr.length - 1
        } else if (countPrev === countArr.length) {
          countPrev = 0;
        }

        countNum.textContent = clickedNum;

        prevCount.textContent = countArr[countNext];
        nextCount.textContent = countArr[countPrev];

        return false;
      };
    }

    /* If element has class, remove on click - else add */
    if ([...el.classList].includes('active_h_count') || disable === true) {
      el.classList.remove('active_h_count');
      document.querySelector('#cover_div').style.display = 'none'
      document.querySelector('body').style.overflow = 'visible';
      inactiveEl.forEach(function(e) {
        e.style.display = 'none';
      });
    } else {
      el.classList.add('active_h_count');
      document.querySelector('#cover_div').style.display = 'block'
      document.querySelector('body').style.overflow = 'hidden'; // Disable the scroll when cover_div is active
      inactiveEl.forEach(function(e) {
        e.style.display = 'inline-block';
      });
    }
  };

  return (
    <div id="section_container" className="container-fluid">
      <div id="cover_div" onClick={() => handleCount(null, true)}>
      </div>
      <div id="s_1">
        <div id="header_count_div" className="count_div" onClick={handleCount}>
          <h2 className="mh_count n_active mh_type">TOP <span id="prev_count" className="click_span">50</span> WORDS</h2>
          <h2 id="mh_1" className="mh mh_type mh_count">TOP <span id="count_of">100</span> WORDS</h2>
          <h2 className="mh_count n_active mh_type">TOP <span id="next_count" className="click_span">200</span> WORDS</h2>
        </div>
        <ul id="top_words_list">{topWords}</ul>
        <div id="type_box" className="fixed_s_type">
          <h2 id="word_type_header"> </h2>
          <h3>Rank: #<span id="ranking" className="ranking_type"></span> Times Used: <span id="count_word" className="ranking_type"></span></h3>
          <p id="word_type_para"></p>
        </div>
      </div>

      <div id="s_2" className="s_ s_r">
        <h2 id="mh_2" className="mh_type">{`YOU'VE USED ${to_num(mainData.wordCount)} WORDS SINCE -`} <br/> <span id="mh_type_date">{mainData.timeSince.Months} MONTHS</span>!</h2>
        <div id="type_date_div">
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Years)}</span> YEARS</h3>
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Months)}</span> MONTHS</h3>
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Weeks)}</span> WEEKS</h3>
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Days)}</span> DAYS</h3>
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Hours)}</span> HOURS</h3>
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Minutes)}</span> MINUTES</h3>
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Seconds)}</span> SECONDS</h3>
          <h3 className="type_date_header"><span className="type_date_count">{to_num(mainData.timeSince.Milliseconds)}</span> MILLISECONDS</h3>
        </div>
        <p id="word_count_para">{getWordFacts(mainData.wordCount)}</p>
      </div>

      <div id='s_3' className="s_">
        <div className="container-fluid">
          <div className="row">
            <div id="versus_div">
              <p><span className="versus_points"></span>+<br/><span className="versus_text"></span></p>
              <h3 className="versus_text_header">VS</h3>
              <p><span className="versus_text"></span><br/><span className="versus_points"></span>+</p>
            </div>
            <div className="col-sm-6 col-md-6 message_total_side">
              <div className="message_total_con">
                <div className="message_total_div">
                  <h3 className="winner_header">WINNER!!!</h3>
                  <h2 className="user_type_total">{''}</h2>
                  <h3 className="user_type_total_count">{''}</h3>
                  <h4>All Time Messages</h4>
                  <div className="stats_total_div">
                    <h3>Word Count<br/>
                    <span className="stats_word_count">0</span></h3>
                    <h3>Favorite Word<br/>
                    <span className="stats_favorite_word">0</span></h3>
                    <h3>Most Active Month<br/>
                    <small>All Time</small><br/>
                    <span className="stats_most_active">0</span></h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-6 message_total_side">
              <div className="message_total_con">
                <div className="message_total_div" style={{float: 'right', textAlign: 'right'}}>
                  <h3 className="winner_header">WINNER!!!</h3>
                  <h2 className="user_type_total">{''}</h2>
                  <h3 className="user_type_total_count">{''}</h3>
                  <h4>All Time Messages</h4>
                  <div className="stats_total_div">
                    <h3>Word Count<br/>
                    <span className="stats_word_count">0</span></h3>
                    <h3>Favorite Word<br/>
                    <span className="stats_favorite_word">0</span></h3>
                    <h3>Most Active Month<br/>
                    <small>All Time</small><br/>
                    <span className="stats_most_active">0</span></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="s_4" className="s_">
        <div id="camera_container">
          <img src={camera} alt="Camera without flash" className="camera_man"/>
        </div>
        <h2 id="SURPRISE-YOU" className="text-center">Say Cheese!</h2>
        <h3 id="surprise_sub_header" className="text-center">Media Sent!</h3>
      </div>

      <div id="s_5" className="s_">
        <div id="chart_con">
          <ul id="chart_tabs">
            <li className="selected_tab c_tab" id="daily">Daily
            <small className="small_tab"> All Time</small></li>
            <li className="c_tab" id="weekly">Weekly
            <small className="small_tab"> All Time</small></li>
            <li className="c_tab" id="monthly">Monthly
            <small className="small_tab"> All Time</small></li>
            <li className="c_tab" id="yearly">Yearly
            <small className="small_tab"> All Time</small></li>
          </ul>
          <canvas id="chart_of">
          </canvas>
        </div>
      </div>

      <div id="s_6" className="s_">
        <div id="s_6_row" className="row">
          <div id="ranking_con" className="col-md-4">
            <div id="ranking_box_hold" className="ranking_box">
              <h4>Placeholder Title</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>

          <div className="total_messages_hr_con col-md-8">
            <div id="score_bar">
              <h4><img src={camera} alt="Camera" className="point_type"/> x<span id="media_Count_score">0</span></h4>
              <h4><img src={words} alt="Speech bubble right" className="point_type"/> x<span id="wordCount_score">0</span></h4>
              <h4><img src={time} alt="Hourglass" className="point_type"/> x<span id="duration_score">0</span></h4>
              <h4><img src={speech} alt="Speech bubble right" className="point_type"/> x<span id="total_messages_score">0</span></h4>
            </div>
            <div id="counting_box">
              <h6 id="media_Count">Media</h6>
              <h6 id="wordCount">Word Count</h6>
              <h6 id="duration">Duration</h6>
              <h6 id="total_messages" className="picked_score_header">Total Messages</h6>
              <h2 id="total_score">{''}</h2>
              <h4 id="point_collect_header">Points collected</h4>

              <h3 id="score_ranking_header">{''}</h3>
              <p id="score_ranking_para"></p>
              <div id="checked_scores">
              </div>
            </div>
            <div id="points_instruction">
              <h2>How points are collected</h2>
              <h3>Duration - <small>5 points per day.</small></h3>
              <h3>Words - <small>5 words for 1 point.</small></h3>
              <h3>Media - <small>10 points per media.</small></h3>
              <h3>Total Messages - <small>1 point per message.</small></h3>
            </div>
          </div>
        </div>
      </div>

      <div id="s_7" className="s_">
        <h3 className="text-center">You have reached the end of your WhatsApp Journey!<br/><small>Ready for another adventure?</small></h3>
        <Button id="rstBtn" size="large" variant="contained" color="primary" style={{backgroundColor: primary}} onClick={() => window.location.replace(window.location.origin)}>
          Back to Home
        </Button>
      </div>

      <Modal data={n_history}/>
    </div>
  )
}

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={Topic}/>
    <Route exact path={match.path} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const App = () => (
  <Router>
    <div style={{height: '100%'}}>
      <Route exact path="/" component={Home}/>
      <Route path="/result" component={Result}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
)

export default App;
