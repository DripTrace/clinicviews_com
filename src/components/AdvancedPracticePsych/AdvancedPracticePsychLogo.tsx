interface APPLogo {
    id: string;
    className: string;
}

const AdvancedPracticePsychLogo = ({ id, className }: APPLogo) => {
    return (
        <svg
            width="1024"
            height="1024"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            id={id}
            className={className}
        >
            <defs id="defs1" />
            <g id="layer1">
                <path
                    d="m 491.63137,3.8908859 c -6.09583,1.9989794 -12.19165,7.9959141 -25.3993,23.9877381 -19.19894,23.311133 -39.19106,45.979084 -59.94228,67.965255 -30.60856,35.541141 -61.08787,71.189811 -91.43735,106.945331 1.01597,2.99847 6.09583,-1.99898 38.60688,-39.97956 22.39332,-27.17808 45.42824,-53.83838 69.08603,-79.959128 C 436.86134,65.371156 451.77067,48.370238 467.24807,31.876579 490.61537,4.8903737 495.69524,1.8919063 513.98271,7.8888409 519.06257,8.8883325 680.60187,143.81935 680.60187,146.81782 l -17.27148,5.99694 -21.33538,8.9954 c 14.12215,-3.15253 28.03342,-7.15807 41.65477,-11.99387 26.20686,20.16065 52.28397,40.48401 78.22975,60.96883 L 689.7456,148.8168 c 0,-0.99949 2.03196,-1.99898 12.19165,-4.99745 l 26.41525,-9.99489 -6.09582,0.99949 c -7.65014,3.04318 -15.4488,5.71174 -23.36734,7.99592 -14.22356,3.99795 -8.12774,7.99591 -53.84642,-30.98416 C 601.97188,75.925444 558.9624,39.943788 516.01466,3.8908859 c -7.11182,-1.9989796 -17.27151,-1.9989796 -24.38329,0 M 614.5638,168.80658 l -14.2236,3.99796 c -92.43166,28.34551 -184.55164,57.66554 -276.34402,87.95504 -16.40471,1.53173 -128.18319,44.60343 -103.62901,35.9816 l 23.36733,-6.99642 c 67.32853,-22.85653 135.07095,-44.51565 203.19414,-64.96679 31.34671,-10.44188 62.84509,-20.43782 94.48528,-29.98467 29.15251,-10.86002 58.62884,-20.85939 88.38944,-29.98468 0,-0.99948 -4.06391,0 -15.23956,3.99796 m 326.12658,195.89986 11.17565,9.99488 c 12.14396,10.00027 24.00157,20.33237 35.55899,30.98414 2.03195,-1.99896 0,-4.99742 -2.03196,-4.99742 -1.01595,0.99947 -2.03191,0 -3.04791,-0.99952 -13.28985,-12.32951 -27.19179,-24.00449 -41.65477,-34.98208 m 47.7506,18.99027 v 1.99899 -3.99798 1.99899 m 0,25.98673 c -0.24345,24.33728 0.43436,48.67501 2.03195,72.96269 l 13.20757,-10.99439 c 5.2917,-4.08925 10.0669,-8.78696 14.2237,-13.99283 3.0479,0 6.0958,-14.99233 3.0479,-20.98927 -2.032,-6.99645 -24.38335,-26.9862 -27.43126,-25.98673 l -1.01596,-0.99947 -1.01599,-1.99899 c -2.03192,0 1.01599,2.99846 12.19161,12.99334 16.2556,13.99286 19.3035,22.98826 12.1917,34.98213 -2.0319,3.99795 -22.35136,20.98927 -24.38331,20.98927 -1.10689,-21.30851 -1.10689,-42.65877 0,-63.96728 -1.01596,0.99947 -2.03192,0.99947 -2.03192,-1.999 0,-2.99846 0,-2.99846 -1.01599,-0.99947 m -10.1597,78.95962 c -28.1652,22.58697 -56.2738,45.24212 -84.32557,67.96527 -52.25418,39.6826 -103.73925,80.33577 -154.42752,121.93764 -24.81735,21.01689 -50.22652,41.34776 -76.1978,60.96886 -44.58238,36.20607 -89.62735,71.85737 -135.12408,106.94531 l -8.12778,-0.99948 c -44.39334,-8.53691 -89.13676,-15.20622 -134.10812,-19.98979 l -12.19167,-1.99896 c -26.94183,-4.67243 -54.05379,-8.33983 -81.27765,-10.99439 0,2.99847 1.01597,2.99847 24.38329,5.99694 45.2755,5.02949 90.34738,11.69725 135.12413,19.98979 l 55.87837,7.99589 c 15.23956,2.99847 17.27152,2.99847 11.17569,6.99645 -30.61916,23.39968 -60.76551,47.3921 -90.4214,71.96321 l -106.67693,84.9566 c -10.15971,7.9959 -13.20762,9.9948 -23.36733,9.9948 -12.19164,0 -14.22359,-1.9989 -40.63883,-23.9877 L 174.64849,927.41875 C 130.54206,891.1992 86.516556,854.88433 42.572313,818.47446 c -5.079853,-0.99948 -2.031939,2.99846 14.22359,15.99181 L 231.54285,979.39221 c 54.86242,45.97649 54.86242,45.97649 70.10197,43.97749 10.15971,-0.9995 12.19165,-1.9989 38.60689,-22.9882 l 26.41524,-20.98929 c 46.21182,-35.70973 91.93465,-72.02781 137.15606,-108.94433 24.3833,-19.98976 25.39926,-20.98927 27.43121,-19.98976 21.90526,3.98551 43.92803,7.31864 66.03807,9.99488 39.76708,7.46562 79.74532,13.79835 119.88452,18.99028 30.23659,4.04187 60.38368,8.70717 90.4214,13.99286 l 71.11794,9.99488 c 17.27151,1.99899 52.8305,-6.99642 67.05406,-16.99129 28.4472,-17.99081 40.63885,-35.98161 44.70272,-61.96834 2.03195,-8.9954 2.03195,-334.82885 0,-336.8278 -2.03195,-3.99799 -3.04791,2.99846 -3.04791,168.91364 0,182.9065 0,170.91263 -6.09583,185.90496 -11.17569,27.98569 -43.68672,50.97395 -79.24571,56.97088 -15.23956,1.99899 -23.36733,1.99899 -46.73463,-1.99899 -26.3067,-4.66367 -52.73063,-8.66293 -79.24571,-11.99387 -14.92619,-2.17314 -29.82796,-4.50542 -44.70273,-6.99641 l -25.39925,-3.99794 c -56.80313,-9.54523 -113.70023,-18.54105 -170.68307,-26.98621 20.04887,-19.50388 41.80722,-37.23021 65.02211,-52.97293 54.26885,-42.80043 108.1178,-86.11364 161.53933,-129.93357 l 27.43121,-21.98878 c 46.52175,-37.5716 93.25712,-74.88643 140.20395,-111.94277 56.89437,-45.97648 55.87837,-44.97701 53.84646,-44.97701 l -5.07987,2.99847"
                    id="path1"
                />
                <path
                    d="m 513.98271,1.8919063 c 6.09582,0.9994916 9.14373,3.997959 38.6069,28.9851847 l 80.26166,67.965255 53.84642,44.977004 9.14374,-2.99846 c 16.06176,-5.88641 32.32714,-11.22026 48.76659,-15.99183 23.98917,-7.83027 48.0344,-15.49322 72.13393,-22.98825 48.76659,-15.991821 42.67077,-16.991308 60.95824,-16.991308 134.10821,6.996422 121.91648,114.941238 118.86856,193.900868 l -4.06387,125.93561 13.20762,10.99439 c 16.2555,13.99282 18.2875,16.99129 18.2875,26.98621 0,10.99435 -2.032,14.99233 -18.2875,27.98568 l -13.20762,10.99439 v 169.91312 c 0,186.90448 1.01596,173.9111 -6.09582,190.90242 -14.2236,37.9806 -68.07006,66.96576 -112.77274,60.96883 C 801.93879,894.00961 730.46433,883.0125 659.26649,870.44788 620.054,864.00496 580.76717,858.00761 541.41392,852.45707 l -12.19165,-1.99895 -5.07987,3.99794 c -26.25236,20.44039 -52.32989,41.09723 -78.22971,61.96834 l -32.51108,25.98669 c -29.08282,24.10941 -58.54963,47.76691 -88.38946,70.96371 -10.15971,7.996 -16.25553,9.9949 -26.41524,9.9949 -14.22359,0 -14.22359,0 -56.89435,-35.9816 L 157.37699,918.42335 C 115.32396,888.03648 75.904704,854.27134 39.524401,817.47498 c 3.047912,-1.99899 0,-3.99798 75.181829,57.97035 41.75573,34.92683 83.75014,69.57657 125.98036,103.94688 46.73464,38.98009 45.71868,38.98009 58.92629,38.98009 10.15971,0 11.17568,-0.9995 32.51106,-18.99033 37.44797,-30.56956 75.38221,-60.55794 113.78875,-89.95402 24.79896,-19.83525 49.18725,-40.16235 73.14988,-60.96882 -74.54027,-12.90503 -149.40871,-23.90312 -224.52954,-32.98314 -3.04791,-0.99948 -3.04791,-0.99948 -3.04791,-2.99847 0,-2.99847 0,-2.99847 10.1597,-1.99899 l 16.25553,1.99899 16.25553,2.99847 22.35136,2.99847 c 52.85504,7.8379 105.68581,15.83387 158.49143,23.98773 13.20764,1.999 13.20764,1.999 19.30346,-2.99846 81.99504,-65.99461 164.28947,-131.62839 246.88083,-196.89936 34.51995,-28.09127 69.40446,-55.74607 104.64501,-82.95757 26.5349,-20.84312 52.95053,-41.83273 79.24571,-62.96781 l 20.31938,-16.99133 v -72.96269 l -3.04791,-2.99847 C 964.83019,385.86418 946.16533,369.17141 926.46678,353.71205 L 862.46063,299.73964 C 804.95184,247.32213 744.94182,197.62471 682.63382,150.81578 c -17.88996,3.98854 -35.52972,8.99439 -52.83046,14.99233 -10.31191,4.16255 -20.82256,7.83163 -31.49511,10.99438 -23.27388,7.61479 -46.64302,14.94494 -70.10194,21.98876 l -91.43736,29.98467 c -29.22255,10.04867 -58.69484,19.38012 -88.38948,27.9857 -26.72357,7.3512 -53.1574,15.68613 -79.24571,24.98722 -19.93201,5.50588 -39.91356,10.83671 -59.94226,15.99185 -2.03195,-2.99847 -5.07986,-1.99899 38.60688,-14.99234 8.17295,-2.53008 16.30187,-5.19578 24.38329,-7.99593 C 408.09132,233.14977 543.5613,190.16946 678.56995,145.81833 677.55396,142.81987 517.03062,8.8883325 513.98271,7.8888409 497.72719,1.8919063 490.61537,5.8898653 473.34389,25.879644 c -23.86445,29.032575 -48.59725,57.363839 -74.16588,84.956566 -17.99075,20.00077 -35.60392,40.32719 -52.83048,60.96884 -24.38329,27.98569 -28.44718,31.98365 -30.47912,31.98365 -5.07985,0 -3.04791,-2.99847 6.09583,-12.99336 16.76801,-18.21901 33.02955,-36.88303 48.76659,-55.97139 l 21.3354,-23.98774 C 416.55017,81.986265 441.27295,53.333294 466.23207,24.880156 486.5515,0.89241846 495.69524,-3.1055366 513.98271,1.8919063 M 875.66823,90.846436 c -10.15969,0.999488 -20.31938,3.997955 -44.70268,11.993864 -35.48871,12.54542 -71.40781,23.87974 -107.69291,33.98263 -9.91202,4.29791 -20.09234,7.97015 -30.47912,10.99438 l 21.33538,19.98978 273.29612,233.88042 C 976.24933,319.72944 1046.3513,82.850522 875.66823,90.846436 M 238.55305,329.5244 c 2.03194,1.99899 2.03194,127.9346 0,129.93359 -4.06389,5.99694 -15.23956,1.99896 -15.23956,-4.99745 0,-5.99694 0,-5.99694 -5.07986,-0.99948 -11.17567,10.99435 -34.543,12.99334 -53.84644,5.99693 -36.57494,-14.99233 -37.59092,-73.9622 -2.03194,-90.95351 18.28747,-7.99589 42.67077,-5.99694 55.87838,4.99746 l 4.06389,2.99846 v -22.98826 c 0,-25.98669 0,-24.98721 6.09582,-25.98669 6.09582,0 9.14373,0 10.15971,1.99895 m 647.17331,0 c 2.03196,0.99952 3.04791,71.9632 2.03196,109.9438 l -1.016,20.98927 -4.06387,0.99948 c -8.12778,0.99951 -12.19165,-0.99948 -12.19165,-6.99641 0,-3.99795 0,-3.99795 -6.09582,0 -18.44975,12.12729 -42.50849,12.12729 -60.95824,0 -19.30343,-13.99286 -24.3833,-43.97754 -12.19165,-67.96527 12.19165,-23.98773 51.81451,-30.98414 74.16585,-12.99333 l 4.0639,2.99846 1.01596,-23.98773 c 0,-22.98827 0,-22.98827 2.03196,-23.98774 3.04791,-1.99899 11.17565,-0.99948 13.2076,0.99947 m -811.760554,0.99952 c 2.031942,0 6.095824,6.99641 14.223586,24.98721 8.765845,21.77777 18.598408,43.12518 29.463148,63.96728 l 11.17568,24.98725 c 8.12776,15.99181 8.12776,15.99181 0,16.99129 -11.17568,0.99951 -13.20762,0 -18.28747,-12.99335 l -10.15971,-21.98875 -2.031942,-3.99798 H 34.342951 c -7.682882,15.11651 -6.982503,30.03926 -14.617745,41.01575 -4.995938,7.18219 -16.346045,3.44267 -18.2271068,3.36875 -3.9892416,-0.15678 -1.46577401,-11.13553 25.7330578,-74.36917 8.887586,-19.929 18.37415,-39.59426 28.447177,-58.96981 l 2.031943,-3.99799 h 8.127762 l 8.127767,0.99952 m -8.127767,19.98975 -23.367322,50.97393 c -4.063882,7.99593 -6.095824,6.99645 24.383295,6.99645 h 26.415235 l -1.01597,-2.99847 -5.079854,-10.99439 C 79.816165,379.9485 72.7034,365.28736 65.838039,350.51367 m 354.573751,14.99234 c 19.30347,5.99694 22.35138,13.99285 22.35138,52.97292 0,30.98415 0,29.98467 6.09583,29.98467 8.12773,0 7.11178,11.99387 -2.03196,12.99335 -8.12778,0.99951 -17.27151,-2.99847 -19.30347,-7.99589 0,-2.99847 0,-2.99847 -5.07982,0.99948 -33.52704,21.98874 -83.30961,1.99899 -69.08602,-28.9852 5.07985,-11.99387 14.22359,-15.99181 51.8145,-20.98927 15.23956,-1.99895 20.31943,-4.99742 20.31943,-10.99436 0,-10.99439 -13.20765,-17.99078 -28.44721,-15.99183 -13.2076,0.9995 -18.28746,4.99744 -21.33537,15.99183 l -2.03194,3.99795 h -7.11179 c -7.1118,0 -7.1118,0 -8.12777,-2.99847 -2.03194,-5.99693 3.04791,-15.99181 10.15971,-21.98873 7.11179,-3.99798 10.1597,-5.99693 22.35134,-7.99593 5.07987,-0.99947 24.3833,0 29.46316,0.99948 m 109.72483,-0.99948 c 22.35138,4.99746 25.39929,12.99335 25.39929,61.96832 v 33.98262 l -3.04791,0.99948 c -3.04791,0.99951 -9.14373,0.99951 -12.19165,-0.99948 l -2.03195,-0.99948 -1.01596,-34.98213 c 0,-32.98314 0,-34.98213 -2.03195,-37.98059 -8.12778,-10.99434 -31.49508,-11.99386 -43.68673,-0.99948 -8.12778,6.99641 -8.12778,9.99488 -9.14373,43.97753 l -2.03196,29.98467 c -2.03195,1.99896 -10.15969,2.99847 -13.2076,1.99896 l -3.04792,-1.99896 v -44.977 c 0,-51.97345 -1.01599,-48.97498 8.12774,-48.97498 8.12778,0 9.14374,0 9.14374,6.99645 1.016,5.99692 1.016,5.99692 4.06391,2.99847 7.11178,-8.9954 28.44716,-13.99286 44.70268,-10.9944 m 103.62901,0 c 18.28747,3.99795 34.54303,19.98978 33.52703,32.98313 l -1.01596,2.99847 -5.07986,0.99947 c -7.11179,0 -9.14374,-0.99947 -11.17566,-4.99742 -6.09582,-16.99132 -25.39929,-23.98772 -43.68676,-16.99132 -13.19282,5.49103 -19.54319,20.20666 -19.43084,34.68354 0.11251,14.50937 6.71701,28.77898 19.43084,33.28172 18.28747,6.99642 36.57494,0 43.68676,-16.99132 l 2.03192,-4.99746 h 16.25556 v 1.99899 c 0,19.98979 -22.35138,35.98161 -47.75064,35.98161 -38.6069,0 -59.94228,-28.9852 -48.76659,-66.96576 7.11178,-23.98772 32.51107,-36.9811 61.9742,-31.98365 m 105.66096,0.99948 c 18.28747,2.99847 29.46316,13.99285 35.55898,33.98264 3.04792,7.99589 3.04792,13.99282 0,16.99129 l -2.03195,1.99899 h -79.24571 l 1.01596,4.99746 c 3.04791,28.98516 50.79854,36.98108 64.00615,10.99435 3.04791,-5.99693 4.06391,-5.99693 14.2236,-3.99794 6.09582,0.99947 0,13.99286 -9.14374,21.98875 -10.15969,7.99592 -19.30343,10.99439 -35.55898,10.99439 -31.49508,0 -49.78255,-16.99133 -51.8145,-44.97701 -2.03192,-36.98108 25.39929,-59.96933 62.99019,-52.97292 m -472.42637,0.99952 c 2.03195,1.99895 6.09583,10.99435 26.41524,59.96932 l 6.09583,15.99182 6.09582,-13.99286 c 6.04605,-14.67914 12.14191,-29.3384 18.28747,-43.9775 8.12776,-18.9903 8.12776,-18.9903 18.28747,-18.9903 10.15971,0 10.15971,0 0,21.98877 l -16.25553,34.98209 c -18.28747,40.97907 -16.25553,38.98008 -27.43121,38.98008 h -8.12776 l -2.03194,-3.99795 -6.09583,-11.99387 c -8.05877,-21.28479 -16.8692,-42.28683 -26.41523,-62.96781 l -6.09583,-15.99179 c 3.04791,-1.999 15.23956,-0.99952 17.2715,0 m -85.34153,10.99435 c -19.30344,2.99845 -30.47912,21.98877 -25.39927,45.97651 6.09583,36.98108 59.94227,33.98261 66.0381,-3.99798 5.07985,-26.98621 -13.20762,-45.97647 -40.63883,-41.97853 m 537.44847,0.9995 c -12.19165,1.99895 -23.3673,13.99282 -24.38329,23.98774 v 2.99846 h 64.00615 v -2.99846 c -2.03192,-16.99133 -21.33539,-28.98518 -39.62286,-23.98774 m 105.66096,0 c -28.44716,7.99589 -31.49507,56.97088 -4.06387,68.96474 25.39926,9.99488 49.78255,-5.99693 49.78255,-32.98313 0,-27.98572 -19.30343,-42.97804 -45.71868,-35.98161 m 167.73676,63.16768 c 0,35.98161 -1.01599,33.98266 10.15972,23.98774 20.3194,-16.99129 20.3194,-25.98669 0,-44.97701 l -9.14376,-6.99641 -1.01596,27.98568 m -575.141,-26.1866 -12.19165,1.99899 c -28.44718,3.99795 -35.55897,7.99589 -35.55897,17.99081 0,14.99233 25.39928,19.98975 44.70271,8.9954 9.14373,-4.99746 11.17569,-8.9954 11.17569,-21.98879 v -7.99588 h -3.04791 l -5.07987,0.99947 m 553.80562,82.158 c -18.61021,16.78458 -37.93077,32.7906 -57.91033,47.97548 -50.89193,39.44891 -101.35468,79.43077 -151.37964,119.93869 -49.27284,40.26189 -99.05934,79.91143 -149.34768,118.93921 l -22.35134,17.9908 -18.28748,13.99283 c -10.89764,8.58863 -21.73492,17.25107 -32.51107,25.98672 -4.06387,2.99847 -3.04791,3.99795 5.07987,4.99746 18.75567,1.70019 37.40754,4.36917 55.87837,7.99589 67.14879,9.72384 134.20566,20.05231 201.16219,30.98419 22.67808,3.73593 45.36821,7.40072 68.07002,10.99435 45.71868,7.99593 97.53318,-19.98976 112.77274,-61.9683 l 3.04791,-7.99592 V 486.64407 L 971.1695,497.63846 M 83.312737,560.50632 c 28.447173,1.99899 42.670763,14.99234 42.670763,38.98007 0,19.9898 -13.20762,32.98314 -36.574943,36.98113 l -30.479116,1.99895 H 34.546146 l -1.015971,25.98673 v 24.98721 l -2.031941,0.99952 c -4.063883,1.99895 -10.159707,1.99895 -13.207619,0 -0.659135,-85.25941 -4.96441,-113.37999 4.106415,-124.27995 6.622502,-7.95788 15.955911,-8.84444 60.915707,-5.65366 m 409.436193,0.99951 c 6.09582,1.99896 8.12774,10.99436 3.04791,15.99182 -5.07987,4.99746 -15.23956,2.99846 -17.27151,-2.99847 -2.03196,-5.99693 1.01595,-12.99335 6.09582,-13.99286 4.06387,-0.99948 5.07987,0 8.12778,0.99951 m -51.81451,4.99742 c 2.03192,1.999 2.03192,1.999 3.04792,14.99234 v 13.99286 h 10.15969 c 10.15969,0 11.17569,0.99948 11.17569,5.99693 0,6.99642 -2.03195,7.99593 -12.19165,7.99593 h -9.14373 v 29.98467 c 0,39.97955 -0.0346,38.98008 15.23956,38.98008 h 7.11178 v 4.99742 c 0,7.99592 -2.03196,8.9954 -14.2236,8.9954 -13.20761,0 -19.30343,-2.99847 -24.3833,-11.99387 -2.03195,-2.99847 -2.03195,-3.99794 -2.03195,-36.98108 v -33.98262 h -8.12774 c -9.14374,-0.99951 -10.15974,-1.99899 -10.15974,-8.9954 v -3.99798 l 9.14374,-0.99948 h 8.12778 v -12.99334 c 1.01596,-15.99186 5.07986,-19.9898 16.25555,-15.99186 M 34.546146,598.48692 v 25.98673 h 4.063881 c 11.175678,0.99947 44.70271,-0.99952 50.798534,-2.99847 22.351349,-6.99645 24.383289,-36.98112 2.031939,-44.97701 -6.09582,-1.99899 -10.159706,-1.99899 -36.57494,-2.99847 -24.195741,-2.32413 -20.319414,3.32788 -20.319414,24.98722 M 195.0695,595.48845 v 10.99439 c 0,1.99896 -1.01597,1.99896 -8.12776,2.99847 -14.22359,1.99895 -22.35136,5.99693 -28.44718,15.99181 l -2.03194,3.99795 -1.01597,29.98467 v 28.98519 l -3.04792,1.999 c -3.04791,1.99895 -11.17567,1.99895 -14.22358,0 -1.01597,-1.999 -3.04791,-88.95455 -1.01597,-92.95249 1.01597,-0.99951 2.03194,-1.99899 8.12776,-1.99899 9.14374,0 9.14374,0 9.14374,9.99488 v 6.99645 l 2.03194,-2.99847 c 8.45338,-12.47438 35.55897,-20.98927 38.60688,-13.99286 m 66.0381,-0.99948 c 11.17567,1.99896 21.33538,7.99589 25.39926,15.99182 2.03194,2.99846 2.03194,4.99745 3.04791,34.98213 0,34.98209 0,34.98209 6.09583,34.98209 5.07985,0 5.07985,0 5.07985,5.99693 0,9.99492 -19.30344,8.99541 -25.39927,-0.99947 l -3.04791,-4.99746 -4.06388,3.99798 c -24.13866,23.74707 -69.086,7.99589 -69.086,-18.99032 0,-18.99028 10.1597,-25.98669 46.73465,-29.98467 21.33538,-2.99847 26.41523,-5.99693 25.39926,-14.99234 -3.04791,-17.9908 -42.35018,-19.279 -49.78256,-0.99947 l -2.03194,4.99746 c -1.01597,2.99846 -12.19165,3.99794 -14.22359,1.99895 -2.03194,-1.99895 -1.01597,-10.99436 2.03194,-15.99181 7.1118,-12.99335 30.47912,-19.9898 53.84645,-15.99182 m 105.66094,0 c 16.25553,2.99847 27.43121,10.99436 33.52703,22.98823 4.06387,10.99439 3.04791,12.99338 -8.12778,12.99338 -5.07982,0 -6.09582,0 -9.14372,-6.99645 -7.11179,-16.99129 -31.49509,-21.98875 -48.76659,-8.9954 -19.30344,13.99286 -16.25553,54.97192 6.09582,62.96781 19.30345,6.99645 38.60689,0 45.71867,-16.99129 2.03195,-5.99693 4.06391,-6.99645 12.19165,-6.99645 h 5.07986 v 6.99645 c 0,39.97955 -81.27765,44.97701 -95.50124,5.99694 -16.25552,-42.97806 15.23956,-79.95914 58.9263,-71.96322 m 208.27401,0 c 18.28747,3.99795 33.52703,17.99081 34.54299,30.98415 v 4.99746 l -4.06387,0.99948 c -8.12778,0.99947 -11.17569,0 -13.20764,-3.99795 -9.14374,-24.98725 -45.71868,-26.9862 -58.92629,-3.99798 -6.09582,10.99439 -5.07987,30.98419 2.03195,42.97806 12.19165,20.98927 50.79851,16.99129 57.91033,-5.99694 2.03192,-4.99746 2.03192,-4.99746 10.1597,-4.99746 8.12777,0 8.12777,0 7.11178,6.99642 -11.17565,39.97958 -79.24571,42.97805 -95.50123,2.99846 -16.25552,-40.97902 16.25552,-79.9591 59.94228,-70.9637 m 106.67692,0 c 23.3673,3.99795 38.60686,21.98875 38.60686,44.97701 0,8.9954 6.09582,7.99589 -48.76659,8.9954 h -34.54299 v 4.99742 c 0,29.13989 48.76659,36.98113 65.02211,10.9944 l 4.0639,-5.99694 h 5.07983 c 9.14374,0 10.15973,3.99795 4.06391,14.99234 -14.2236,23.98774 -66.03811,26.9862 -84.32558,3.99794 -31.49507,-37.98056 1.01596,-91.95297 50.79855,-82.95757 m -185.92263,1.99896 c 2.03191,2.99846 2.03191,91.953 0,93.952 -3.04791,1.99895 -11.17569,1.99895 -14.2236,0 -2.03196,-0.99952 -4.06387,-91.95301 -2.03196,-93.952 2.03196,-1.99896 15.23956,-1.99896 16.25556,0 m 163.57125,11.99387 c -10.1597,3.99798 -21.33539,13.77341 -21.33539,22.98826 v 3.99794 h 64.00616 v -2.99847 c 0,-16.99129 -23.3673,-29.98467 -42.67077,-23.98773 m -391.1487,34.98213 -12.19165,1.99899 c -22.40869,3.67416 -26.41524,4.99742 -30.47912,6.99641 -17.2715,7.99592 -8.12776,27.98568 12.19165,27.98568 13.20762,0 28.44718,-6.99641 32.51106,-13.99282 3.04791,-5.99694 1.01597,-24.98725 -2.03194,-22.98826"
                    id="path2"
                />
            </g>
        </svg>
    );
};

export default AdvancedPracticePsychLogo;
