# TicketsLoader
### Summary
This is a simple ticket loading animation in React Native, written with the help of reanimated-2.

### Use case
Can be used as a loading screen or just a quick transition animation.

### How to use
The user can pass custom props inside the TicketAnimation component, otherwise default props are used.

Props:

prop                      | description                         | default value
--------------------------|-------------------------------------|----------------
`R`                       | circle radius                       | 40
`STROKE_WIDTH`            | width of the circular strokes       | 15
`REC_WIDTH`               | ticket width                        | 150
`REC_HEIGHT`              | ticket height                       | 93
`TIME_EXPAND_STROKE`      | dot to arc expansion time           | 500
`TIME_ROTATION`           | strokes rotation time               | 2500
`DELAY_ROTATION`          | time before strokes starts rotating | 0
`TIME_SHRINK_STROKE`      | dot to arc expansion time           | 500
`STROKE_LENGTH`           | arc length                          | 0.1
`TICKET_DAMPING`          | ticket expansion damping            | 12
`TICKET_MASS`             | ticket expansion mass               | 1.2
`TICKET_STIFFNESS`        | ticket expansion stiffness          | 100
`ROTATION_NUM_OF_CIRCLES` | number of stroke rotations          | 2
`COLOR_PRIMARY1`          | ticket 1 color                      | tomato
`COLOR_PRIMARY2`          | ticket 2 color                      | turquoise
`COLOR_PRIMARY3`          | ticket 2 color                      | royalblue
`COLOR_PRIMARY4`          | ticket 2 color                      | coral

To start:
Start Expo server with npm start, then open animation in your favourite Android / iOS emulator or install Expo Go on your mobile phone and scan run it there.
