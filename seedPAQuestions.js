const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const { Question } = require('./models/Test');

// PA Driver's Manual Questions from Chapters 2, 3, and 4
const paQuestions = [
  // Chapter 2 - Signals, Signs and Pavement Markings
  {
    questionId: 'ch2-001',
    question: 'WHEN YOU SEE THIS SIGN, YOU MUST:',
    options: [
      'Stop completely, check for pedestrians, and cross traffic',
      'Slow down without coming to a complete stop',
      'Stop completely and wait for a green light',
      'Slow down and check for traffic'
    ],
    correctAnswer: 'Stop completely, check for pedestrians, and cross traffic',
    explanation: 'A stop sign requires you to come to a complete stop, check for pedestrians and cross traffic before proceeding.',
    category: 'chapter-2-signs',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-002',
    question: 'THIS IS THE SHAPE AND COLOR OF A __________ SIGN.',
    options: ['Stop', 'Wrong Way', 'Yield', 'Do not enter'],
    correctAnswer: 'Yield',
    explanation: 'A triangular sign with a red border and white background is a yield sign.',
    category: 'chapter-2-signs',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-003',
    question: 'THIS SIGN MEANS:',
    options: ['Stop', 'No U-Turn', 'Yield', 'Do not enter'],
    correctAnswer: 'Do not enter',
    explanation: 'A square sign with a red circle and white horizontal bar means "Do not enter".',
    category: 'chapter-2-signs',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-004',
    question: 'THIS SIGN MEANS:',
    options: ['No U-Turn', 'No Turning', 'No left turn', 'No right turn'],
    correctAnswer: 'No U-Turn',
    explanation: 'A sign with a U-turn symbol and a red circle with slash means no U-turns are allowed.',
    category: 'chapter-2-signs',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-005',
    question: 'YOU NEED TO USE EXTRA CAUTION WHEN DRIVING NEAR A PEDESTRIAN USING A WHITE CANE BECAUSE:',
    options: [
      'He or she is deaf',
      'He or she has a mental disability',
      'He or she is blind',
      'He or she has a walking problem'
    ],
    correctAnswer: 'He or she is blind',
    explanation: 'A white cane is used by blind or visually impaired pedestrians to navigate. Drivers must use extra caution.',
    category: 'chapter-2-pedestrians',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-006',
    question: 'WHEN DRIVING NEAR A BLIND PEDESTRIAN WHO IS CARRYING A WHITE CANE OR USING A GUIDE DOG, YOU SHOULD:',
    options: [
      'Slow down and be prepared to stop',
      'Take the right-of-way',
      'Proceed normally',
      'Drive away quickly'
    ],
    correctAnswer: 'Slow down and be prepared to stop',
    explanation: 'Drivers must slow down and be prepared to stop when approaching a blind pedestrian with a white cane or guide dog.',
    category: 'chapter-2-pedestrians',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-007',
    question: 'IF THERE ARE NO SIGNALS AT A RAILROAD CROSSING, YOU SHOULD:',
    options: [
      'Slow down and prepare to stop if you see or hear a train approaching',
      'Proceed as quickly as possible over the tracks',
      'Proceed through the crossing at a normal rate',
      'Proceed slowly over the tracks'
    ],
    correctAnswer: 'Slow down and prepare to stop if you see or hear a train approaching',
    explanation: 'At railroad crossings without signals, slow down and prepare to stop if you see or hear a train approaching.',
    category: 'chapter-2-railroad',
    difficulty: 'medium'
  },
  {
    questionId: 'ch2-008',
    question: 'YOU MAY DRIVE AROUND THE GATES AT A RAILROAD CROSSING:',
    options: [
      'When the train has passed',
      'Never',
      'When the lights have stopped flashing',
      'When other drivers drive around the gates'
    ],
    correctAnswer: 'Never',
    explanation: 'It is illegal and extremely dangerous to drive around gates at a railroad crossing. Never do this.',
    category: 'chapter-2-railroad',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-009',
    question: 'HIGHWAY AND EXPRESSWAY GUIDE SIGNS ARE:',
    options: [
      'Orange with black letters',
      'Green with white letters',
      'Yellow with black letters',
      'Red with white letters'
    ],
    correctAnswer: 'Green with white letters',
    explanation: 'Highway and expressway guide signs are green with white letters to provide directional information.',
    category: 'chapter-2-signs',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-010',
    question: 'A YELLOW AND BLACK DIAMOND-SHAPED SIGN:',
    options: [
      'Warns you about conditions on or near the road',
      'Helps direct you to cities and towns ahead',
      'Tells you about traffic laws and regulations',
      'Tells you about road construction ahead'
    ],
    correctAnswer: 'Warns you about conditions on or near the road',
    explanation: 'Yellow and black diamond-shaped signs are warning signs that alert you to conditions on or near the road ahead.',
    category: 'chapter-2-signs',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-011',
    question: 'FROM TOP TO BOTTOM, THE FOLLOWING IS THE PROPER ORDER FOR TRAFFIC LIGHTS:',
    options: [
      'Red, yellow, green',
      'Red, green, yellow',
      'Green, red, yellow',
      'Green, yellow, red'
    ],
    correctAnswer: 'Red, yellow, green',
    explanation: 'Traffic lights are arranged from top to bottom in the order: red (stop), yellow (caution), green (go).',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-012',
    question: 'IF A GREEN ARROW TURNS INTO A GREEN LIGHT, YOU:',
    options: [
      'May still turn but you must yield to oncoming traffic',
      'May no longer turn and must proceed straight',
      'Still have the right of way to turn',
      'No longer have to turn the way the arrow indicates'
    ],
    correctAnswer: 'May still turn but you must yield to oncoming traffic',
    explanation: 'When a green arrow changes to a green light, you may still turn but must yield to oncoming traffic.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'medium'
  },
  {
    questionId: 'ch2-013',
    question: 'A STEADY YELLOW LIGHT AT AN INTERSECTION MEANS:',
    options: ['Go', 'Yield to other cars', 'Slow down and prepare to stop', 'Stop'],
    correctAnswer: 'Slow down and prepare to stop',
    explanation: 'A steady yellow light means slow down and prepare to stop. Stop if you can do so safely.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-014',
    question: 'A FLASHING YELLOW LIGHT MEANS THAT YOU SHOULD:',
    options: [
      'Slow down and proceed with care',
      'Continue through if the way is clear',
      'Stop and proceed when a green light appears',
      'Stop and proceed when the way is clear'
    ],
    correctAnswer: 'Slow down and proceed with care',
    explanation: 'A flashing yellow light means slow down and proceed with caution.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-015',
    question: 'YOU MUST STOP WHEN YOU SEE A:',
    options: ['Flashing red light', 'Steady yellow light', 'Yellow arrow', 'Flashing yellow light'],
    correctAnswer: 'Flashing red light',
    explanation: 'A flashing red light requires you to come to a complete stop before proceeding.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-016',
    question: 'A STEADY GREEN LIGHT AT AN INTERSECTION MEANS THAT YOU:',
    options: [
      'Must slow down and prepare to stop',
      'Must stop and check for oncoming traffic before proceeding',
      'May drive through the intersection if the road is clear',
      'May not turn right'
    ],
    correctAnswer: 'May drive through the intersection if the road is clear',
    explanation: 'A steady green light means you may proceed through the intersection if the road is clear.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-017',
    question: 'A STEADY YELLOW LIGHT MEANS THAT A _______ LIGHT WILL SOON APPEAR.',
    options: ['Flashing yellow', 'Steady green', 'Steady red', 'Flashing red'],
    correctAnswer: 'Steady red',
    explanation: 'A steady yellow light is a warning that a steady red light will soon appear.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-018',
    question: 'YOU MAY CONTINUE CAREFULLY THROUGH A YELLOW LIGHT IF:',
    options: [
      'There is an emergency vehicle crossing your lane',
      'There are no pedestrians crossing',
      'You are turning right',
      'You are within the intersection'
    ],
    correctAnswer: 'You are within the intersection',
    explanation: 'You may continue through a yellow light if you are already within the intersection when it turns yellow.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'medium'
  },
  {
    questionId: 'ch2-019',
    question: 'YOU MAY TURN LEFT AT A RED LIGHT IF:',
    options: [
      'There is no traffic coming in the opposite direction',
      'You are turning from a two-way street onto a one-way street',
      'You are turning from a one-way street onto another one-way street',
      'The car in front of you turns left'
    ],
    correctAnswer: 'You are turning from a one-way street onto another one-way street',
    explanation: 'You may turn left at a red light when turning from a one-way street onto another one-way street, after coming to a complete stop.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'hard'
  },
  {
    questionId: 'ch2-020',
    question: 'IF A TRAFFIC LIGHT IS BROKEN OR NOT FUNCTIONING YOU SHOULD:',
    options: [
      'Stop and wait for it to be repaired',
      'Stop and wait for a police officer to arrive',
      'Continue as if it were a four-way stop sign',
      'Continue as you normally would'
    ],
    correctAnswer: 'Continue as if it were a four-way stop sign',
    explanation: 'When a traffic light is broken or not functioning, treat the intersection as a four-way stop sign.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'medium'
  },
  {
    questionId: 'ch2-021',
    question: 'YOU MAY TURN RIGHT ON RED IF YOU:',
    options: [
      'Stop first and check for traffic and pedestrians',
      'Have a right turn red arrow',
      'Are in the left lane',
      'Slow down first'
    ],
    correctAnswer: 'Stop first and check for traffic and pedestrians',
    explanation: 'You may turn right on red after coming to a complete stop and checking for traffic and pedestrians.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-022',
    question: 'WHEN MAKING A RIGHT TURN ON A GREEN LIGHT, YOU MUST:',
    options: [
      'Maintain normal driving speed',
      'Stop and look for oncoming traffic',
      'Yield to pedestrians',
      'Increase your normal driving speed'
    ],
    correctAnswer: 'Yield to pedestrians',
    explanation: 'When making a right turn on a green light, you must yield to pedestrians crossing the street.',
    category: 'chapter-2-traffic-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-023',
    question: 'THE SPEED LIMIT IS _______ MILES PER HOUR WHEN THE YELLOW LIGHTS ARE FLASHING ON THE SCHOOL ZONE SPEED SIGN.',
    options: ['25', '15', '20', '35'],
    correctAnswer: '15',
    explanation: 'The speed limit is 15 miles per hour when yellow lights are flashing on a school zone speed sign.',
    category: 'chapter-2-speed-limits',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-024',
    question: 'A FLASHING RED LIGHT AT A RAILROAD CROSSING MEANS:',
    options: [
      'Stop, do not proceed until signals are completed',
      'Slow down and proceed if clear',
      'Proceed with caution',
      'You have the right-of-way'
    ],
    correctAnswer: 'Stop, do not proceed until signals are completed',
    explanation: 'A flashing red light at a railroad crossing means you must stop and not proceed until the signals have stopped flashing.',
    category: 'chapter-2-railroad',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-025',
    question: 'YOU MAY PASS IF THE LINE DIVIDING TWO LANES IS A ___________ LINE.',
    options: ['Broken white', 'Double solid yellow', 'Solid yellow', 'Solid white'],
    correctAnswer: 'Broken white',
    explanation: 'You may pass if the line dividing two lanes is a broken white line, indicating that passing is permitted.',
    category: 'chapter-2-lane-markings',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-026',
    question: 'LANES OF TRAFFIC MOVING IN THE SAME DIRECTION ARE DIVIDED BY ____ LINES.',
    options: ['Yellow', 'White', 'Red', 'Black'],
    correctAnswer: 'White',
    explanation: 'Lanes of traffic moving in the same direction are divided by white lines.',
    category: 'chapter-2-lane-markings',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-027',
    question: 'YOU MAY NOT PASS ANOTHER CAR ON EITHER SIDE OF A _______ CENTERLINE.',
    options: [
      'Combination solid and broken yellow',
      'Single broken yellow',
      'Double solid yellow',
      'Single broken white'
    ],
    correctAnswer: 'Double solid yellow',
    explanation: 'You may not pass another car on either side of a double solid yellow centerline.',
    category: 'chapter-2-lane-markings',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-028',
    question: 'YOU MAY CROSS SOLID YELLOW LINES:',
    options: [
      'To pass traffic moving in the same direction',
      'During daylight hours only',
      'At any time',
      'When making turns'
    ],
    correctAnswer: 'When making turns',
    explanation: 'You may cross solid yellow lines when making turns, such as turning left into a driveway or side street.',
    category: 'chapter-2-lane-markings',
    difficulty: 'medium'
  },
  {
    questionId: 'ch2-029',
    question: 'THE ROAD EDGE ON THE RIGHT SIDE IS MARKED BY A ___________ LINE.',
    options: ['Broken white', 'Solid yellow', 'Solid white', 'Broken yellow'],
    correctAnswer: 'Solid white',
    explanation: 'The road edge on the right side is marked by a solid white line.',
    category: 'chapter-2-lane-markings',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-030',
    question: 'LANES OF TRAFFIC MOVING IN THE OPPOSITE DIRECTION ARE DIVIDED BY ____ LINES.',
    options: ['White', 'Red', 'Black', 'Yellow'],
    correctAnswer: 'Yellow',
    explanation: 'Lanes of traffic moving in the opposite direction are divided by yellow lines.',
    category: 'chapter-2-lane-markings',
    difficulty: 'easy'
  },
  {
    questionId: 'ch2-031',
    question: 'THE POSTED SPEED LIMITS SHOW:',
    options: [
      'The minimum legal speed limit',
      'The exact speed at which you must travel to avoid a ticket',
      'The maximum safe speed under ideal road and weather conditions',
      'The maximum safe speed under all road conditions'
    ],
    correctAnswer: 'The maximum safe speed under ideal road and weather conditions',
    explanation: 'Posted speed limits show the maximum safe speed under ideal road and weather conditions. You should adjust your speed based on actual conditions.',
    category: 'chapter-2-speed-limits',
    difficulty: 'medium'
  },
  {
    questionId: 'ch2-032',
    question: 'FROM THE CENTER LANE, WHAT MANEUVERS CAN YOU PERFORM?',
    options: [
      'Make left turns',
      'Make U-turns',
      'Pass slower-moving traffic',
      'All of the above'
    ],
    correctAnswer: 'Make left turns',
    explanation: 'A center lane is typically used for left turns only, not for passing or U-turns.',
    category: 'chapter-2-lane-markings',
    difficulty: 'medium'
  },

  // Chapter 3 - Learning to Drive
  {
    questionId: 'ch3-001',
    question: 'TEENAGE DRIVERS ARE MORE LIKELY TO BE INVOLVED IN A CRASH WHEN:',
    options: [
      'They are driving with their pet as a passenger',
      'They are driving with adult passengers',
      'They are driving with teenage passengers',
      'They are driving without any passengers'
    ],
    correctAnswer: 'They are driving with teenage passengers',
    explanation: 'Teenage drivers are more likely to be involved in a crash when driving with other teenage passengers, as peer influence can be distracting.',
    category: 'chapter-3-teen-drivers',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-002',
    question: 'DRIVERS WHO EAT AND DRINK WHILE DRIVING:',
    options: [
      'Have no driving errors',
      'Have trouble driving slow',
      'Are better drivers because they are not hungry',
      'Have trouble controlling their vehicles'
    ],
    correctAnswer: 'Have trouble controlling their vehicles',
    explanation: 'Eating and drinking while driving is distracting and can cause drivers to have trouble controlling their vehicles.',
    category: 'chapter-3-distractions',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-003',
    question: 'PREPARING TO SMOKE AND SMOKING WHILE DRIVING:',
    options: [
      'Do not affect driving abilities',
      'Help maintain driver alertness',
      'Are distracting activities',
      'Are not distracting activities'
    ],
    correctAnswer: 'Are distracting activities',
    explanation: 'Preparing to smoke and smoking while driving are distracting activities that can impair your ability to drive safely.',
    category: 'chapter-3-distractions',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-004',
    question: 'THE TOP MAJOR CRASH TYPE FOR 16 YEAR OLD DRIVERS IN PENNSYLVANIA IS:',
    options: [
      'Single vehicle/run-off-the-road',
      'Being sideswiped on an interstate',
      'Driving in reverse on a side street',
      'Driving on the shoulder of a highway'
    ],
    correctAnswer: 'Single vehicle/run-off-the-road',
    explanation: 'The top major crash type for 16-year-old drivers in Pennsylvania is single vehicle/run-off-the-road crashes.',
    category: 'chapter-3-teen-drivers',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-005',
    question: 'WHEN PASSING A BICYCLIST, YOU SHOULD:',
    options: [
      'Blast your horn to alert the bicyclist',
      'Move as far left as possible',
      'Remain in the center of the lane',
      'Put on your four-way flashers'
    ],
    correctAnswer: 'Move as far left as possible',
    explanation: 'When passing a bicyclist, you should move as far left as possible to give them adequate space.',
    category: 'chapter-3-sharing-road',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-006',
    question: 'WHEN YOU DRIVE THROUGH AN AREA WHERE CHILDREN ARE PLAYING, YOU SHOULD EXPECT THEM:',
    options: [
      'To know when it is safe to cross',
      'To stop at the curb before crossing the street',
      'To run out in front of you without looking',
      'Not to cross unless they are with an adult'
    ],
    correctAnswer: 'To run out in front of you without looking',
    explanation: 'When driving through areas where children are playing, you should expect them to run out in front of you without looking, so drive with extra caution.',
    category: 'chapter-3-pedestrians',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-007',
    question: 'IF YOU ARE DRIVING BEHIND A MOTORCYCLE, YOU MUST:',
    options: [
      'Allow the motorcycle to use a complete lane',
      'Drive on the shoulder beside the motorcycle',
      'Allow the motorcycle to use only half a lane',
      'Pass in the same lane where the motorcycle is driving'
    ],
    correctAnswer: 'Allow the motorcycle to use a complete lane',
    explanation: 'Motorcycles have the right to use a complete lane, and you must allow them to do so.',
    category: 'chapter-3-sharing-road',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-008',
    question: 'WHEN TRAVELING BEHIND A MOTORCYCLE:',
    options: [
      'Allow a following distance of at least 2 car lengths',
      'Allow at least 2 seconds of following distance',
      'Allow at least 4 seconds of following distance',
      'Allow a following distance of at least 4 motorcycle lengths'
    ],
    correctAnswer: 'Allow at least 4 seconds of following distance',
    explanation: 'When traveling behind a motorcycle, you should allow at least 4 seconds of following distance for safety.',
    category: 'chapter-3-following-distance',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-009',
    question: 'AN ORANGE TRIANGLE ON THE BACK OF A VEHICLE INDICATES THAT VEHICLE:',
    options: [
      'Carries radioactive materials',
      'Takes wide turns',
      'Travels at slower speeds than normal traffic',
      'Makes frequent stops'
    ],
    correctAnswer: 'Travels at slower speeds than normal traffic',
    explanation: 'An orange triangle on the back of a vehicle indicates it travels at slower speeds than normal traffic (typically farm equipment or slow-moving vehicles).',
    category: 'chapter-3-signs',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-010',
    question: 'AT NIGHT, IT IS HARDEST TO SEE:',
    options: ['Road signs', 'Pedestrians', 'Other motorists', 'Street lights'],
    correctAnswer: 'Pedestrians',
    explanation: 'At night, pedestrians are hardest to see because they do not have headlights or reflectors like vehicles do.',
    category: 'chapter-3-night-driving',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-011',
    question: 'WHEN A TRUCK DRIVER BEHIND YOU WANTS TO PASS YOUR VEHICLE, YOUR SPEED SHOULD:',
    options: [
      'Remain steady or decrease',
      'Change lanes',
      'Change',
      'Increase'
    ],
    correctAnswer: 'Remain steady or decrease',
    explanation: 'When a truck driver behind you wants to pass, maintain a steady speed or decrease slightly to allow them to pass safely.',
    category: 'chapter-3-trucks',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-012',
    question: 'WHEN SHARING THE ROAD WITH A TRUCK, IT IS IMPORTANT TO REMEMBER THAT, IN GENERAL, TRUCKS:',
    options: [
      'Take longer distances than cars to stop',
      'Require less time to pass on a downgrade than cars',
      'Require less turning radius than cars',
      'Require less time to pass on an incline than cars'
    ],
    correctAnswer: 'Take longer distances than cars to stop',
    explanation: 'Trucks take longer distances than cars to stop due to their greater weight and size.',
    category: 'chapter-3-trucks',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-013',
    question: 'IF YOU ARE FOLLOWING A TRUCK THAT SWINGS LEFT BEFORE MAKING A RIGHT TURN AT AN INTERSECTION, YOU SHOULD REMEMBER THAT IT IS VERY DANGEROUS TO:',
    options: [
      'Try to squeeze between the truck and curb to make a right turn',
      'Apply your brakes until the truck has completed the turn',
      'Violate the "4 – second" following distance rule',
      'Honk your horn at the truck driver'
    ],
    correctAnswer: 'Try to squeeze between the truck and curb to make a right turn',
    explanation: 'Never try to squeeze between a truck and the curb when a truck swings left before making a right turn. This is extremely dangerous.',
    category: 'chapter-3-trucks',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-014',
    question: 'THE ONLY TIME YOU DO NOT HAVE TO STOP FOR A SCHOOL BUS WHOSE RED LIGHTS ARE FLASHING AND STOP ARM IS EXTENDED IS WHEN YOU:',
    options: [
      'Are driving on the opposite side of a divided highway',
      'Are behind the bus',
      'See no children present',
      'Can safely pass on the left'
    ],
    correctAnswer: 'Are driving on the opposite side of a divided highway',
    explanation: 'You only do not have to stop for a school bus with flashing red lights and extended stop arm when you are on the opposite side of a divided highway (with a barrier or median).',
    category: 'chapter-3-school-bus',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-015',
    question: 'WHEN A SCHOOL BUS HAS ITS LIGHTS FLASHING AND ITS STOP ARM EXTENDED, YOU MUST:',
    options: [
      'Stop at least 10 feet away from the bus',
      'Pass if children have exited the bus',
      'Stop if the bus is on the opposite side of a barrier',
      'Drive slowly by the bus'
    ],
    correctAnswer: 'Stop at least 10 feet away from the bus',
    explanation: 'When a school bus has its lights flashing and stop arm extended, you must stop at least 10 feet away from the bus.',
    category: 'chapter-3-school-bus',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-016',
    question: 'AFTER A TRAIN HAS PASSED, YOU SHOULD:',
    options: [
      'Check again for approaching trains and proceed with caution',
      'Wait for a green light',
      'Proceed across the tracks',
      'Blow horn and proceed'
    ],
    correctAnswer: 'Check again for approaching trains and proceed with caution',
    explanation: 'After a train has passed, check again for approaching trains before proceeding across the tracks with caution.',
    category: 'chapter-3-railroad',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-017',
    question: 'IF YOU NEED TO SLOW DOWN OR STOP WHEN OTHER DRIVERS MAY NOT EXPECT IT, YOU SHOULD:',
    options: [
      'Quickly tap your brake pedal a few times',
      'Use your emergency brake',
      'Look over your shoulder for traffic in your blind spot',
      'Get ready to blow your horn'
    ],
    correctAnswer: 'Quickly tap your brake pedal a few times',
    explanation: 'If you need to slow down unexpectedly, quickly tap your brake pedal a few times to alert drivers behind you with your brake lights.',
    category: 'chapter-3-signals',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-018',
    question: 'WHEN YOU ARE PLANNING TO MAKE A TURN, YOU SHOULD ACTIVATE YOUR TURN SIGNALS:',
    options: [
      'Only if there are other drivers following you',
      'Just as the front of your car reaches the intersection',
      '3 to 4 seconds before you reach the intersection',
      '2 car lengths before reaching the intersection'
    ],
    correctAnswer: '3 to 4 seconds before you reach the intersection',
    explanation: 'You should activate your turn signals 3 to 4 seconds before you reach the intersection to give other drivers adequate warning.',
    category: 'chapter-3-signals',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-019',
    question: 'BEFORE PASSING ANOTHER VEHICLE YOU SHOULD:',
    options: [
      'Flash your headlights to alert the driver',
      'Turn on your four-way flashers to warn the driver',
      'Give the proper turn signal to show you are changing lanes',
      'Sound your horn to get the drivers attention'
    ],
    correctAnswer: 'Give the proper turn signal to show you are changing lanes',
    explanation: 'Before passing another vehicle, give the proper turn signal to indicate you are changing lanes.',
    category: 'chapter-3-passing',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-020',
    question: 'YOUR BLIND SPOT IS THE AREA OF THE ROAD:',
    options: [
      'You cannot see without moving your head',
      'Directly behind your vehicle',
      'You see in your rearview mirror',
      'You see in your side mirror'
    ],
    correctAnswer: 'You cannot see without moving your head',
    explanation: 'Your blind spot is the area of the road you cannot see without moving your head, typically alongside your vehicle.',
    category: 'chapter-3-visibility',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-021',
    question: 'BEFORE PASSING ANOTHER VEHICLE, YOU SHOULD SIGNAL:',
    options: [
      'Just before changing lanes',
      'At any time',
      'After changing lanes',
      'Early enough so others know your plans'
    ],
    correctAnswer: 'Early enough so others know your plans',
    explanation: 'Before passing, signal early enough so other drivers know your plans before you execute the maneuver.',
    category: 'chapter-3-passing',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-022',
    question: 'BEFORE CHANGING LANES ON A MULTI-LANE HIGHWAY YOU SHOULD:',
    options: [
      'Sound your horn',
      'Turn on your headlights',
      'Reduce your speed',
      'Check your mirrors and blind spots'
    ],
    correctAnswer: 'Check your mirrors and blind spots',
    explanation: 'Before changing lanes on a multi-lane highway, check your mirrors and blind spots to ensure it is safe.',
    category: 'chapter-3-lane-changes',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-023',
    question: 'BEFORE BACKING UP, YOU SHOULD:',
    options: [
      'Rely on your mirrors to see if it is clear to proceed',
      'Flash your lights',
      'Open your door to see if it is clear to proceed',
      'Turn your head and look through the rear window'
    ],
    correctAnswer: 'Turn your head and look through the rear window',
    explanation: 'Before backing up, turn your head and look through the rear window to check for obstacles and people.',
    category: 'chapter-3-backing',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-024',
    question: 'IF YOUR TURN SIGNALS FAIL, YOU SHOULD USE _____ TO INDICATE YOU ARE TURNING.',
    options: ['Your horn', 'Your headlights', 'Hand signals', 'Your emergency flashers'],
    correctAnswer: 'Hand signals',
    explanation: 'If your turn signals fail, use hand signals to indicate you are turning.',
    category: 'chapter-3-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-025',
    question: 'YOU MUST USE YOUR HEADLIGHTS WHEN OTHER VEHICLES ARE NOT VISIBLE FROM _____ FEET AWAY.',
    options: ['1000', '1500', '1800', '1200'],
    correctAnswer: '1000',
    explanation: 'You must use your headlights when other vehicles are not visible from 1000 feet away.',
    category: 'chapter-3-headlights',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-026',
    question: 'IF A VEHICLE USING HIGH BEAMS COMES TOWARD YOU, YOU SHOULD:',
    options: [
      'Turn on your high beams',
      'Turn off your headlights',
      'Sound your horn',
      'Flash your high beams'
    ],
    correctAnswer: 'Flash your high beams',
    explanation: 'If a vehicle using high beams comes toward you, flash your high beams briefly to alert them to dim their lights.',
    category: 'chapter-3-headlights',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-027',
    question: 'IF A VEHICLE USING HIGH BEAMS COMES TOWARD YOU, YOU SHOULD LOOK TOWARDS _____ OF THE ROAD.',
    options: ['Either side', 'The center', 'The right side', 'The left side'],
    correctAnswer: 'The right side',
    explanation: 'When oncoming traffic has high beams, look toward the right side of the road to avoid being blinded.',
    category: 'chapter-3-headlights',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-028',
    question: 'YOUR BRAKE LIGHTS TELL OTHER DRIVERS THAT YOU:',
    options: [
      'Are making a turn',
      'Have your emergency brake on',
      'Are changing lanes',
      'Are slowing down or stopping'
    ],
    correctAnswer: 'Are slowing down or stopping',
    explanation: 'Your brake lights tell other drivers that you are slowing down or stopping.',
    category: 'chapter-3-signals',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-029',
    question: 'IF YOU BEGIN TO FEEL TIRED WHILE DRIVING, THE BEST THING TO DO IS:',
    options: ['Get some coffee', 'Open your window', 'Stop driving', 'Turn on the radio'],
    correctAnswer: 'Stop driving',
    explanation: 'If you begin to feel tired while driving, the best thing to do is stop driving and rest.',
    category: 'chapter-3-fatigue',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-030',
    question: 'THE EFFECT THAT LACK OF SLEEP HAS ON YOUR SAFE DRIVING ABILITY IS THE SAME AS:',
    options: [
      'The effect that alcohol has',
      'The effect that amphetamines have',
      'The effect that anger has',
      'The effect that driving with teenagers has'
    ],
    correctAnswer: 'The effect that alcohol has',
    explanation: 'Lack of sleep has the same effect on your safe driving ability as alcohol, impairing reaction time and judgment.',
    category: 'chapter-3-fatigue',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-031',
    question: 'TEENAGERS SHOULD TRY TO GET AT LEAST ___ OF SLEEP EACH NIGHT TO AVOID THE RISK OF DROWSY DRIVING CRASHES.',
    options: ['7 hours', '6 hours', '8 hours', '9 hours'],
    correctAnswer: '8 hours',
    explanation: 'Teenagers should try to get at least 8 hours of sleep each night to avoid the risk of drowsy driving crashes.',
    category: 'chapter-3-fatigue',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-032',
    question: 'FOR AN AVERAGE PERSON, HOW MANY MINUTES DOES THE BODY NEED TO PROCESS THE ALCOHOL IN ONE DRINK?',
    options: ['15', '60', '90', '30'],
    correctAnswer: '60',
    explanation: 'For an average person, it takes about 60 minutes (1 hour) for the body to process the alcohol in one drink.',
    category: 'chapter-3-alcohol',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-033',
    question: '__________ LIMIT(S) YOUR CONCENTRATION, PERCEPTION, JUDGMENT, AND MEMORY.',
    options: [
      'Only a blood alcohol level greater than the legal limit',
      'Alcohol does not',
      'Even the smallest amount of alcohol',
      'Only a blood alcohol level greater than .05'
    ],
    correctAnswer: 'Even the smallest amount of alcohol',
    explanation: 'Even the smallest amount of alcohol limits your concentration, perception, judgment, and memory.',
    category: 'chapter-3-alcohol',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-034',
    question: 'TAKING DRUGS ALONG WITH ALCOHOL:',
    options: [
      'Increases the risk of causing a crash',
      'Is no more dangerous than alcohol by itself',
      'Lessens the effect of alcohol on your ability to drive',
      'Has no effect on your general driving ability'
    ],
    correctAnswer: 'Increases the risk of causing a crash',
    explanation: 'Taking drugs along with alcohol increases the risk of causing a crash, as they can have synergistic effects.',
    category: 'chapter-3-alcohol',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-035',
    question: 'AS ALCOHOL BUILDS UP IN YOUR BLOOD, IT:',
    options: [
      'Slows down your reactions',
      'Makes you feel less confident',
      'Begins to metabolize itself more quickly',
      'Decreases your driving errors'
    ],
    correctAnswer: 'Slows down your reactions',
    explanation: 'As alcohol builds up in your blood, it slows down your reactions, impairing your ability to drive safely.',
    category: 'chapter-3-alcohol',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-036',
    question: 'WHEN YOU HEAR A FIRE ENGINE SIREN, YOU MUST:',
    options: [
      'Slow down until it passes you',
      'Drive with your flashers on',
      'Pull over to the side of the road and stop',
      'Speed up and take the nearest exit'
    ],
    correctAnswer: 'Pull over to the side of the road and stop',
    explanation: 'When you hear a fire engine siren, you must pull over to the side of the road and stop to allow the emergency vehicle to pass.',
    category: 'chapter-3-emergency-vehicles',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-037',
    question: 'IF YOU HAVE A TIRE BLOWOUT, YOU SHOULD:',
    options: [
      'Allow the steering wheel to move freely',
      'Let the car slow to a stop',
      'Continue driving until you reach a garage',
      'Brake hard to stop the car immediately'
    ],
    correctAnswer: 'Let the car slow to a stop',
    explanation: 'If you have a tire blowout, let the car slow to a stop gradually while maintaining control of the steering wheel.',
    category: 'chapter-3-emergencies',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-038',
    question: 'IF YOUR CAR BREAKS DOWN ON A HIGHWAY, YOU SHOULD:',
    options: [
      'Sit in your car and wait for help',
      'Use your four-way flashers to warn other drivers',
      'Sound your horn at passing motorists',
      'Flash your headlights at oncoming traffic'
    ],
    correctAnswer: 'Use your four-way flashers to warn other drivers',
    explanation: 'If your car breaks down on a highway, use your four-way flashers to warn other drivers.',
    category: 'chapter-3-emergencies',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-039',
    question: 'WHEN YOU SEE AN EMERGENCY VEHICLE WITH FLASHING LIGHTS, YOU MUST:',
    options: [
      'Slow down and keep moving in your lane',
      'Keep driving in your lane',
      'Pull to the curb and stop',
      'Stop exactly where you are'
    ],
    correctAnswer: 'Pull to the curb and stop',
    explanation: 'When you see an emergency vehicle with flashing lights, pull to the curb and stop to allow it to pass.',
    category: 'chapter-3-emergency-vehicles',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-040',
    question: 'CRASHES IN WORK ZONES ARE MOST COMMONLY THE RESULT OF:',
    options: [
      'Tire blow-outs',
      'Hydroplaning because of water sprayed on the roadway',
      'Loss of steering control after driving over wet paint',
      'Carelessness and speeding'
    ],
    correctAnswer: 'Carelessness and speeding',
    explanation: 'Crashes in work zones are most commonly the result of carelessness and speeding.',
    category: 'chapter-3-work-zones',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-041',
    question: 'WHEN DRIVING THROUGH A WORK ZONE, IT IS A GOOD SAFETY PRACTICE TO:',
    options: [
      'Drive close to the vehicle in front of you to keep traffic flowing freely',
      'Shorten your usual following distance — by about half',
      'Turn on your cruise control',
      'Lengthen your usual following distance — by double'
    ],
    correctAnswer: 'Lengthen your usual following distance — by double',
    explanation: 'When driving through a work zone, lengthen your usual following distance by double for increased safety.',
    category: 'chapter-3-work-zones',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-042',
    question: 'ON TWO-LANE, TWO-WAY STREETS OR HIGHWAYS, YOU SHOULD START LEFT TURNS:',
    options: [
      'Close to the center line',
      'Close to the outside line',
      'In the center of the lane',
      'Anywhere in the lane'
    ],
    correctAnswer: 'Close to the center line',
    explanation: 'On two-lane, two-way streets or highways, you should start left turns close to the center line.',
    category: 'chapter-3-turning',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-043',
    question: 'TO TURN LEFT ON MULTI-LANE STREETS AND HIGHWAYS, YOU SHOULD START FROM:',
    options: [
      'The middle of the intersection',
      'The right lane',
      'The left lane',
      'Any lane'
    ],
    correctAnswer: 'The left lane',
    explanation: 'To turn left on multi-lane streets and highways, you should start from the left lane.',
    category: 'chapter-3-turning',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-044',
    question: 'ON A TWO-LANE ROAD, YOU MAY PASS ANOTHER VEHICLE ON THE RIGHT WHEN:',
    options: [
      'Driving on a single lane entrance ramp',
      'The driver you are passing is travelling slower than the posted speed limit',
      'Never',
      'The driver you are passing is making a left turn'
    ],
    correctAnswer: 'The driver you are passing is making a left turn',
    explanation: 'On a two-lane road, you may pass another vehicle on the right when the driver you are passing is making a left turn.',
    category: 'chapter-3-passing',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-045',
    question: 'TO PASS A SLOWER-MOVING VEHICLE ON A TWO-LANE ROAD YOU MUST:',
    options: [
      'Not cross the center line',
      'Flash your lights to oncoming traffic',
      'Use the shoulder',
      'Use that lane that belongs to oncoming traffic'
    ],
    correctAnswer: 'Use that lane that belongs to oncoming traffic',
    explanation: 'To pass a slower-moving vehicle on a two-lane road, you must use the lane that belongs to oncoming traffic (after ensuring it is safe).',
    category: 'chapter-3-passing',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-046',
    question: 'THE MOST IMPORTANT THING TO REMEMBER ABOUT SPEED MANAGEMENT AND CURVES IS TO:',
    options: [
      'Drive at the posted speed limit as you enter the curve, then slow down at the sharpest part of the curve',
      'Slow down before you enter the curve',
      'Accelerate gently before you enter the curve',
      'Drive at the posted speed limit of the roadway, before, throughout, and after the curve'
    ],
    correctAnswer: 'Slow down before you enter the curve',
    explanation: 'The most important thing about speed management and curves is to slow down before you enter the curve.',
    category: 'chapter-3-curves',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-047',
    question: 'DRIVERS ENTERING A ROUNDABOUT OR TRAFFIC CIRCLE:',
    options: [
      'Must stop before entering',
      'Must yield to drivers in the roundabout or traffic circle',
      'Have the right of way if they arrive first',
      'Have the right of way if there are two lanes'
    ],
    correctAnswer: 'Must yield to drivers in the roundabout or traffic circle',
    explanation: 'Drivers entering a roundabout or traffic circle must yield to drivers already in the roundabout or traffic circle.',
    category: 'chapter-3-intersections',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-048',
    question: 'THE LAW GIVES _______ THE RIGHT OF WAY AT INTERSECTIONS.',
    options: [
      'No one',
      'Drivers turning left',
      'Drivers going straight',
      'Drivers turning right'
    ],
    correctAnswer: 'No one',
    explanation: 'The law does not give anyone the right of way at intersections. Right of way must be yielded appropriately.',
    category: 'chapter-3-intersections',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-049',
    question: 'AT AN INTERSECTION WITH A STOP SIGN, YOU SHOULD STOP AND:',
    options: [
      'Check your rearview mirror for cars tailgating',
      'Go when the vehicle ahead of you goes',
      'Look right first, then left, then right again',
      'Look left first, then right, then left again'
    ],
    correctAnswer: 'Look left first, then right, then left again',
    explanation: 'At an intersection with a stop sign, you should stop and look left first, then right, then left again before proceeding.',
    category: 'chapter-3-intersections',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-050',
    question: 'WHEN ENTERING A HIGHWAY FROM AN ENTRANCE RAMP, YOU SHOULD GENERALLY:',
    options: [
      'Enter above the speed of traffic to get ahead',
      'Enter slowly to avoid other vehicles',
      'Stop first, then slowly enter traffic',
      'Accelerate to the speed of traffic'
    ],
    correctAnswer: 'Accelerate to the speed of traffic',
    explanation: 'When entering a highway from an entrance ramp, you should accelerate to the speed of traffic to merge safely.',
    category: 'chapter-3-highways',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-051',
    question: 'WHEN EXITING A HIGHWAY, YOU SHOULD SLOW DOWN:',
    options: [
      'On the main road, just before the exit lane',
      'Once you see the toll booth',
      'Once you have moved into the exit lane',
      'When you first see the exit sign'
    ],
    correctAnswer: 'Once you have moved into the exit lane',
    explanation: 'When exiting a highway, you should slow down once you have moved into the exit lane, not before.',
    category: 'chapter-3-highways',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-052',
    question: 'IF YOU WANT TO GET OFF OF A FREEWAY, BUT YOU MISSED YOUR EXIT, YOU SHOULD:',
    options: [
      'Go to the next exit, and get off of the freeway there',
      'Make a U-turn through the median',
      'Pull onto the shoulder and back your car to the exit',
      'Flag down a police officer for an escort back to your exit'
    ],
    correctAnswer: 'Go to the next exit, and get off of the freeway there',
    explanation: 'If you miss your exit, go to the next exit and get off there. Never back up or make illegal maneuvers.',
    category: 'chapter-3-highways',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-053',
    question: '"HIGHWAY HYPNOSIS" IS A DRIVER CONDITION THAT CAN RESULT FROM:',
    options: [
      'Staring at the roadway for long periods of time',
      'Frequent rest stops',
      'Too much sleep the night before your trip',
      'Short trips on expressways'
    ],
    correctAnswer: 'Staring at the roadway for long periods of time',
    explanation: '"Highway hypnosis" is a driver condition that can result from staring at the roadway for long periods of time, reducing alertness.',
    category: 'chapter-3-fatigue',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-054',
    question: 'THE "FOUR-SECOND RULE" REFERS TO HOW ONE SHOULD:',
    options: ['Yield to other cars', 'Turn at stop signs', 'Follow another car', 'Cross an intersection'],
    correctAnswer: 'Follow another car',
    explanation: 'The "four-second rule" refers to maintaining at least four seconds of following distance behind another car.',
    category: 'chapter-3-following-distance',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-055',
    question: 'IT IS BEST TO KEEP A SPACE CUSHION:',
    options: [
      'Only in back of your vehicle',
      'Only on the left and right side of your vehicle',
      'Only in front of the vehicle',
      'On all sides of the vehicle'
    ],
    correctAnswer: 'On all sides of the vehicle',
    explanation: 'It is best to keep a space cushion on all sides of your vehicle for maximum safety and maneuverability.',
    category: 'chapter-3-following-distance',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-056',
    question: 'ALLOW A LARGER SPACE CUSHION WHEN STOPPING:',
    options: ['On an up-hill', 'At an intersection', 'At a stop sign', 'At a toll plaza'],
    correctAnswer: 'At a toll plaza',
    explanation: 'Allow a larger space cushion when stopping at a toll plaza where vehicles may stop suddenly.',
    category: 'chapter-3-following-distance',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-057',
    question: 'WHEN MAKING A TURN, YOU MUST _____ YOUR SPEED.',
    options: ['Increase', 'Maintain', 'Vary', 'Reduce'],
    correctAnswer: 'Reduce',
    explanation: 'When making a turn, you must reduce your speed for safety and control.',
    category: 'chapter-3-turning',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-058',
    question: 'WHEN DRIVING IN TRAFFIC, IT IS SAFEST TO:',
    options: [
      'Fluctuate your speed to keep alert',
      'Drive faster than the flow of traffic',
      'Drive slower than the flow of traffic',
      'Drive with the flow of traffic'
    ],
    correctAnswer: 'Drive with the flow of traffic',
    explanation: 'When driving in traffic, it is safest to drive with the flow of traffic, neither significantly faster nor slower.',
    category: 'chapter-3-speed',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-059',
    question: 'THE MAXIMUM SPEED LIMIT IN THIS STATE IS ____ MILES PER HOUR.',
    options: ['55', '50', '60', '65'],
    correctAnswer: '65',
    explanation: 'The maximum speed limit in Pennsylvania is 65 miles per hour on certain highways.',
    category: 'chapter-3-speed-limits',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-060',
    question: 'DRIVE BELOW THE POSTED SPEED LIMIT WHEN:',
    options: [
      'Anything makes conditions less than perfect',
      'Others drive below the speed limit',
      'Entering a highway where there are other cars',
      'You are on a four lane road'
    ],
    correctAnswer: 'Anything makes conditions less than perfect',
    explanation: 'Drive below the posted speed limit when anything makes conditions less than perfect (weather, traffic, visibility, etc.).',
    category: 'chapter-3-speed-limits',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-061',
    question: 'YOUR ABILITY TO STOP IS AFFECTED BY:',
    options: [
      'Signal lights',
      'Other cars on the road',
      'The time of day',
      'The condition of the road'
    ],
    correctAnswer: 'The condition of the road',
    explanation: 'Your ability to stop is affected by the condition of the road (wet, icy, rough, etc.).',
    category: 'chapter-3-stopping',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-062',
    question: 'AT HIGHWAY SPEEDS, ON A DRY ROAD, A SAFE FOLLOWING DISTANCE IS AT LEAST:',
    options: [
      '3 seconds of following distance from the car ahead of you',
      '2 seconds of following distance from the car ahead of you',
      '4 seconds of following distance from the car ahead of you',
      '2 car lengths of following distance from the car ahead of you'
    ],
    correctAnswer: '4 seconds of following distance from the car ahead of you',
    explanation: 'At highway speeds, on a dry road, a safe following distance is at least 4 seconds of following distance from the car ahead of you.',
    category: 'chapter-3-following-distance',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-063',
    question: 'WHAT CAN YOU DO TO AVOID THE NEED TO MAKE EMERGENCY (OR "PANIC") STOPS WHILE DRIVING IN TRAFFIC?',
    options: [
      'Honk your horn to make others aware of your presence',
      'Look ahead and maintain a safe following distance',
      'Drive in the right lane only',
      'Drive slower than the flow of traffic'
    ],
    correctAnswer: 'Look ahead and maintain a safe following distance',
    explanation: 'To avoid emergency stops, look ahead and maintain a safe following distance to give yourself time to react.',
    category: 'chapter-3-following-distance',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-064',
    question: 'IF AN ONCOMING DRIVER IS HEADING TOWARD YOU IN YOUR LANE, YOU SHOULD:',
    options: [
      'Steer right, blow your horn, and accelerate',
      'Steer left, blow your horn, and brake',
      'Steer right, blow your horn, and brake',
      'Stay in the center of your lane, blow your horn, and brake'
    ],
    correctAnswer: 'Steer right, blow your horn, and brake',
    explanation: 'If an oncoming driver is heading toward you in your lane, steer right, blow your horn, and brake.',
    category: 'chapter-3-emergencies',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-065',
    question: 'IF THE REAR OF YOUR VEHICLE STARTS TO SKID LEFT, YOU SHOULD:',
    options: ['Steer left', 'Hit your brakes', 'Accelerate', 'Steer right'],
    correctAnswer: 'Steer right',
    explanation: 'If the rear of your vehicle starts to skid left, steer right to regain control (steer in the direction you want to go).',
    category: 'chapter-3-skidding',
    difficulty: 'hard'
  },
  {
    questionId: 'ch3-066',
    question: 'THE MOST EFFECTIVE THING YOU CAN DO TO REDUCE YOUR RISK OF GETTING INJURED OR KILLED IN A TRAFFIC CRASH IS:',
    options: [
      'Wear your seat belt',
      'Limit your driving to week days',
      'Stay in the right lane on multi-lane highways',
      'Limit your driving to times between 3:00 p.m. and 6:00 p.m.'
    ],
    correctAnswer: 'Wear your seat belt',
    explanation: 'The most effective thing you can do to reduce your risk of injury or death in a crash is wear your seat belt.',
    category: 'chapter-3-safety',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-067',
    question: 'WHEN DRIVING ON SLICK ROADS, YOU SHOULD:',
    options: [
      'Take turns more slowly',
      'Change lanes quickly',
      'Accelerate quickly',
      'Brake hard'
    ],
    correctAnswer: 'Take turns more slowly',
    explanation: 'When driving on slick roads, take turns more slowly to maintain control.',
    category: 'chapter-3-weather',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-068',
    question: 'WHICH OF THE FOLLOWING IS TRUE ABOUT DRIVING ON A WET ROADWAY?',
    options: [
      'As you drive faster, your tires become less effective',
      'Water does not affect cars with good tires',
      'Deeper water is less dangerous',
      'As you decrease your speed, the roadway becomes more slippery'
    ],
    correctAnswer: 'As you drive faster, your tires become less effective',
    explanation: 'As you drive faster on a wet roadway, your tires become less effective at maintaining traction.',
    category: 'chapter-3-weather',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-069',
    question: 'WHEN DRIVING ON SLIPPERY ROADS, YOU SHOULD:',
    options: [
      'Use alternate routes',
      'Drive as you would on dry roads',
      'Increase your following distance',
      'Avoid crossing bridges or intersections'
    ],
    correctAnswer: 'Increase your following distance',
    explanation: 'When driving on slippery roads, increase your following distance to allow more time to stop.',
    category: 'chapter-3-weather',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-070',
    question: 'WHEN DRIVING ON WET ROADS, YOU SHOULD:',
    options: [
      'Drive the speed limit',
      'Drive slightly faster than the speed limit',
      'Drive 5 to 10 miles below the speed limit',
      'Stay close to the vehicle ahead'
    ],
    correctAnswer: 'Drive 5 to 10 miles below the speed limit',
    explanation: 'When driving on wet roads, drive 5 to 10 miles below the speed limit for increased safety.',
    category: 'chapter-3-weather',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-071',
    question: 'WHEN DRIVING ON WET ROADS, YOU SHOULD:',
    options: [
      'Increase following distance to 5 or 6 seconds',
      'Decrease following distance to 2 seconds',
      'Not be concerned about following distance',
      'Maintain the 4-second following distance rule'
    ],
    correctAnswer: 'Increase following distance to 5 or 6 seconds',
    explanation: 'When driving on wet roads, increase your following distance to 5 or 6 seconds for added safety.',
    category: 'chapter-3-weather',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-072',
    question: 'ROADS FREEZE MORE QUICKLY WHEN THEY ARE:',
    options: ['Flat', 'Curvy', 'In the sun', 'Shaded'],
    correctAnswer: 'Shaded',
    explanation: 'Roads freeze more quickly when they are in shaded areas that receive less sunlight.',
    category: 'chapter-3-weather',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-073',
    question: 'ROADS BECOME VERY SLIPPERY:',
    options: [
      'When it has been raining for an hour or more',
      'The day after it rains',
      'For the first 10 to 15 minutes of a rain storm',
      'Right after the rain has stopped'
    ],
    correctAnswer: 'For the first 10 to 15 minutes of a rain storm',
    explanation: 'Roads become very slippery for the first 10 to 15 minutes of a rain storm as oil and water mix on the surface.',
    category: 'chapter-3-weather',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-074',
    question: 'HYDROPLANING IS USUALLY CAUSED BY:',
    options: ['Excessive stops', 'Sudden stops', 'Sudden turns', 'Excessive speed'],
    correctAnswer: 'Excessive speed',
    explanation: 'Hydroplaning is usually caused by excessive speed, which causes tires to lose contact with the road surface.',
    category: 'chapter-3-weather',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-075',
    question: 'HYDROPLANING CAN BE HELPED BY DRIVING:',
    options: ['Through shallow water', 'Faster', 'Slower', 'Through deep water'],
    correctAnswer: 'Slower',
    explanation: 'Hydroplaning can be prevented or reduced by driving slower on wet roads.',
    category: 'chapter-3-weather',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-076',
    question: 'WHEN DRIVING IN FOG, YOU SHOULD USE YOUR _________.',
    options: ['Low beam headlights', 'High beam headlights', 'Parking lights', 'Hazard flashers'],
    correctAnswer: 'Low beam headlights',
    explanation: 'When driving in fog, use your low beam headlights. High beams will reflect off the fog and reduce visibility.',
    category: 'chapter-3-weather',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-077',
    question: 'COMPARED TO DRIVING DURING THE DAY, DRIVING AT NIGHT IS:',
    options: [
      'Less dangerous',
      'No more of less dangerous',
      'More dangerous',
      'Easier on your eyes'
    ],
    correctAnswer: 'More dangerous',
    explanation: 'Compared to driving during the day, driving at night is more dangerous due to reduced visibility.',
    category: 'chapter-3-night-driving',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-078',
    question: 'ANYTHING THAT REQUIRES YOU TO _______ COULD CAUSE YOU TO CRASH.',
    options: [
      'Take your eyes off the road',
      'Take your hands off the wheel',
      'Take your attention away from the driving task',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    explanation: 'Anything that requires you to take your eyes off the road, hands off the wheel, or attention away from driving could cause a crash.',
    category: 'chapter-3-distractions',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-079',
    question: 'DISTRACTED DRIVERS ARE AT A GREATER RISK OF A CRASH WHEN THEY ARE USING WHICH OF THE FOLLOWING:',
    options: ['CD player', 'Radio', 'Cell phone', 'All of the above'],
    correctAnswer: 'All of the above',
    explanation: 'Distracted drivers are at greater risk of a crash when using any device that takes attention away from driving, including CD players, radios, and cell phones.',
    category: 'chapter-3-distractions',
    difficulty: 'easy'
  },
  {
    questionId: 'ch3-080',
    question: 'WHEN YOU ARE IN A LINE OF TRAFFIC THAT IS CROSSING A RAILROAD TRACK THAT HAS NO SIGNALS OR GATES:',
    options: [
      'You have the right of way and do not need to check for trains',
      'You may pass slower drivers crossing the track',
      'You need to make sure there is space to get all the way across the tracks without stopping, before you start to cross',
      'All of the above'
    ],
    correctAnswer: 'You need to make sure there is space to get all the way across the tracks without stopping, before you start to cross',
    explanation: 'Before crossing railroad tracks, ensure there is space to get all the way across without stopping on the tracks.',
    category: 'chapter-3-railroad',
    difficulty: 'medium'
  },
  {
    questionId: 'ch3-081',
    question: 'WHEN APPROACHING A STOPPED SCHOOL BUS WITH ITS RED LIGHTS FLASHING AND ITS STOP ARM EXTENDED, YOU MUST:',
    options: [
      'Stop 5 feet away from the bus',
      'Stop only if you see children are present',
      'Stop and remain stopped until it appears safe to proceed',
      'Stop and remain stopped until the red lights stop flashing and the stop arm has been withdrawn'
    ],
    correctAnswer: 'Stop and remain stopped until the red lights stop flashing and the stop arm has been withdrawn',
    explanation: 'When approaching a stopped school bus with red lights flashing and stop arm extended, you must stop and remain stopped until the red lights stop flashing and the stop arm has been withdrawn.',
    category: 'chapter-3-school-bus',
    difficulty: 'easy'
  },

  // Chapter 4 - Driving Record Information
  {
    questionId: 'ch4-001',
    question: 'THE MINIMUM DRINKING AGE IN THIS STATE IS ____ YEARS.',
    options: ['9', '20', '21', '18'],
    correctAnswer: '21',
    explanation: 'The minimum drinking age in Pennsylvania is 21 years.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'easy'
  },
  {
    questionId: 'ch4-002',
    question: 'PEOPLE UNDER 16 YEARS OF AGE WHO USE A FALSE IDENTIFICATION CARD TO BUY ALCOHOL WILL:',
    options: [
      'Receive a driving suspension that starts on their 16th birthday',
      'Not be able to take the driver\'s exam until their 21st birthday',
      'Receive a driving suspension that starts on their 21st birthday',
      'Be sent to an alcohol safety education class'
    ],
    correctAnswer: 'Receive a driving suspension that starts on their 16th birthday',
    explanation: 'People under 16 who use a false ID to buy alcohol will receive a driving suspension that starts on their 16th birthday.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'medium'
  },
  {
    questionId: 'ch4-003',
    question: 'IF A PERSON UNDER 21 YEARS OLD CONSUMES ALCOHOL, BUT IS NOT DRIVING A MOTOR VEHICLE, THE PENALTY FOR A FIRST OFFENSE IS:',
    options: [
      'A 90-day driver license suspension and up to a $500 fine',
      'A 6-month probation',
      'Sentence to a corrections institution',
      'Points on the driving record'
    ],
    correctAnswer: 'A 90-day driver license suspension and up to a $500 fine',
    explanation: 'For a first offense of underage drinking (not driving), the penalty is a 90-day driver license suspension and up to a $500 fine.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'hard'
  },
  {
    questionId: 'ch4-004',
    question: 'PARENTAL CONSENT TO CONDUCT BREATH, BLOOD, AND URINE TESTS IS:',
    options: [
      'Not required',
      'Required from only one parent',
      'Required for people under 16 years old',
      'Required from both parents'
    ],
    correctAnswer: 'Not required',
    explanation: 'Parental consent is not required to conduct breath, blood, and urine tests for alcohol or drugs.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'hard'
  },
  {
    questionId: 'ch4-005',
    question: 'IT IS AGAINST THE LAW FOR ANYONE UNDER THE AGE OF 21 TO ______ ALCOHOL.',
    options: [
      'Wear clothing advertising',
      'Be in the presence of',
      'Consume',
      'Serve'
    ],
    correctAnswer: 'Consume',
    explanation: 'It is against the law for anyone under the age of 21 to consume alcohol.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'easy'
  },
  {
    questionId: 'ch4-006',
    question: 'IT IS AGAINST THE LAW FOR ANYONE UNDER THE AGE OF 21 TO ______ ALCOHOL.',
    options: [
      'Wear clothing advertising',
      'Possess',
      'Serve',
      'Be in the presence of'
    ],
    correctAnswer: 'Possess',
    explanation: 'It is against the law for anyone under the age of 21 to possess alcohol.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'easy'
  },
  {
    questionId: 'ch4-007',
    question: 'IT IS AGAINST THE LAW FOR ANYONE UNDER THE AGE OF 21 TO ______ ALCOHOL.',
    options: [
      'Serve',
      'Wear clothing advertising',
      'Be in the presence of',
      'Transport'
    ],
    correctAnswer: 'Transport',
    explanation: 'It is against the law for anyone under the age of 21 to transport alcohol.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'easy'
  },
  {
    questionId: 'ch4-008',
    question: 'ONE OF THE PENALTIES FOR DRIVING UNDER THE INFLUENCE OF ALCOHOL IS A(N):',
    options: [
      '5 – year driver\'s license suspension',
      '$100.00 fine',
      'Attendance to Alcohol Highway Safety School',
      '12 – hour sentence in jail'
    ],
    correctAnswer: 'Attendance to Alcohol Highway Safety School',
    explanation: 'One of the penalties for driving under the influence is attendance to Alcohol Highway Safety School.',
    category: 'chapter-4-dui',
    difficulty: 'medium'
  },
  {
    questionId: 'ch4-009',
    question: 'IF YOU ARE ARRESTED FOR DRIVING UNDER THE INFLUENCE OF ALCOHOL AND YOU REFUSE TO TAKE THE BLOOD TEST, YOU WILL RECIEVE A:',
    options: [
      'Drug counseling treatment',
      'Sentence of one day in jail',
      'Driver\'s License Suspension',
      '$300.00 fine'
    ],
    correctAnswer: 'Driver\'s License Suspension',
    explanation: 'If you refuse to take a blood, breath, or urine test when arrested for DUI, you will receive a driver\'s license suspension.',
    category: 'chapter-4-dui',
    difficulty: 'medium'
  },
  {
    questionId: 'ch4-010',
    question: 'IF A POLICE OFFICER REQUIRES YOU TO TAKE A BLOOD, BREATH, OR URINE TEST, YOU:',
    options: [
      'May choose the test you prefer',
      'Must sign a consent form',
      'May refuse if underage',
      'Must take the test, or your license will be suspended'
    ],
    correctAnswer: 'Must take the test, or your license will be suspended',
    explanation: 'If a police officer requires you to take a blood, breath, or urine test, you must take it or your license will be suspended.',
    category: 'chapter-4-dui',
    difficulty: 'medium'
  },
  {
    questionId: 'ch4-011',
    question: 'FOR A FIRST CONVICTION FOR DRIVING UNDER THE INFLUENCE AT ANY BLOOD ALCOHOL CONCENTRATION LEVEL, YOU COULD:',
    options: [
      'Lose your license for up to 5 years',
      'Be required to conduct a public education class on the dangers of drunk driving',
      'Be required to drive with a restricted occupational license',
      'Pay a fine of at least $300'
    ],
    correctAnswer: 'Pay a fine of at least $300',
    explanation: 'For a first DUI conviction, you could pay a fine of at least $300.',
    category: 'chapter-4-dui',
    difficulty: 'medium'
  },
  {
    questionId: 'ch4-012',
    question: 'IF UNDER 21 YEARS OF AGE YOU ARE CONSIDERED TO BE DRIVING WHILE UNDER THE INFLUENCE IF YOUR BLOOD ALCOHOL LEVEL IS:',
    options: ['.08% or higher', '.10% or higher', '.05% or higher', '.02% or higher'],
    correctAnswer: '.02% or higher',
    explanation: 'If under 21 years of age, you are considered to be driving under the influence if your blood alcohol level is .02% or higher (zero tolerance law).',
    category: 'chapter-4-dui',
    difficulty: 'medium'
  },
  {
    questionId: 'ch4-013',
    question: 'IF YOU ARE UNDER AGE 21 AND ARE CONVICTED OF DRIVING UNDER THE INFLUENCE OF ALCOHOL, YOU WILL RECEIVE A ____ LICENSE SUSPENSION FOR A FIRST OFFENSE.',
    options: ['60-Day', '30-Day', '6-Month', '1-Year'],
    correctAnswer: '1-Year',
    explanation: 'If under 21 and convicted of DUI, you will receive a 1-year license suspension for a first offense.',
    category: 'chapter-4-dui',
    difficulty: 'hard'
  },
  {
    questionId: 'ch4-014',
    question: 'IF YOU ARE UNDER AGE 21, AND ARE CONVICTED OF CARRYING A FALSE ID CARD, YOU WILL BE REQUIRED TO PAY A $500 FINE AND YOUR LICENSE WILL BE SUSPENDED FOR 90 DAYS.',
    options: [
      'Only if your blood alcohol content (BAC) is .02% or higher',
      'Even if you were not driving',
      'Only if you were driving at the time of arrest',
      'Only if your blood alcohol content (BAC) is .02% or higher and you were driving at the time of arrest'
    ],
    correctAnswer: 'Even if you were not driving',
    explanation: 'If under 21 and convicted of carrying a false ID card, you will pay a $500 fine and receive a 90-day license suspension even if you were not driving.',
    category: 'chapter-4-alcohol-laws',
    difficulty: 'hard'
  },
  {
    questionId: 'ch4-015',
    question: 'THE ZERO TOLERANCE LAW REDUCED THE BLOOD ALCOHOL CONTENT (BAC) FROM .08% TO ____ FOR DRIVERS UNDER 21 TO BE CHARGED WITH DRIVING UNDER THE INFLUENCE.',
    options: ['.02%', '.05%', '.07%', '.00%'],
    correctAnswer: '.02%',
    explanation: 'The zero tolerance law sets the BAC limit at .02% for drivers under 21 to be charged with DUI (reduced from .08%).',
    category: 'chapter-4-dui',
    difficulty: 'medium'
  },
  {
    questionId: 'ch4-016',
    question: 'IF YOU ARE STOPPED BY A POLICE OFFICER, YOU SHOULD:',
    options: [
      'Unbuckle your seat belt and lower your window',
      'Get your paperwork ready before the officer reaches your car',
      'Stay in your vehicle with your hands on the steering wheel, and wait for the officer to approach you',
      'Get out of your car and walk toward the patrol car'
    ],
    correctAnswer: 'Stay in your vehicle with your hands on the steering wheel, and wait for the officer to approach you',
    explanation: 'If stopped by a police officer, stay in your vehicle with your hands on the steering wheel and wait for the officer to approach you.',
    category: 'chapter-4-law-enforcement',
    difficulty: 'easy'
  }
];

// Initialize PA questions in database
const initializePAQuestions = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/military-license-assistance';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    console.log('✓ Connected to MongoDB');

    const count = await Question.countDocuments();
    
    // Delete existing questions to replace with new ones
    if (count > 0) {
      await Question.deleteMany({});
      console.log(`✓ Cleared ${count} existing questions`);
    }

    // Insert new questions
    await Question.insertMany(paQuestions);
    console.log(`✓ Successfully seeded ${paQuestions.length} PA Driver's Manual questions`);
    console.log('\nQuestions are now ready in your database!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n❌ ERROR: Cannot connect to MongoDB!\n');
      console.error('MongoDB is not running or not accessible at:');
      console.error(`   ${process.env.MONGODB_URI || 'mongodb://localhost:27017/military-license-assistance'}\n`);
      console.error('SOLUTIONS:');
      console.error('1. Start MongoDB locally:');
      console.error('   - macOS: brew services start mongodb-community');
      console.error('   - Linux: sudo systemctl start mongod');
      console.error('   - Or run: mongod\n');
      console.error('2. Use MongoDB Atlas (Cloud - Recommended):');
      console.error('   - Sign up at https://www.mongodb.com/cloud/atlas');
      console.error('   - Create a free cluster');
      console.error('   - Update MONGODB_URI in config.env with your connection string\n');
      console.error('3. Check your config.env file has the correct MONGODB_URI\n');
    } else {
      console.error('\n❌ Error initializing PA questions:', error.message);
      if (error.stack) {
        console.error('\nStack trace:', error.stack);
      }
    }
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  initializePAQuestions();
}

module.exports = { paQuestions, initializePAQuestions };

