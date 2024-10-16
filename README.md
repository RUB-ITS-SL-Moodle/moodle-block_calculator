# Basic Calculator #

The Basic Calculator is a simple and straightforward calculator with the most common operators such as plus,
minus, times and divide.

## Description ##
The calculator is integrated as a block plugin in the Moodle course and can be used by any user in this course.

It can be used by simply clicking on the buttons or with the keyboard. The buttons look like this:

```
0 - 9          --> Numbers
+              --> Add
-              --> Subtract
*              --> Multiply
/ or ÷         --> Divide
( and )        --> Open and closed parentheses
,              --> decimal number
N              --> Negative number
Enter          --> Calculate
Backwards      --> Delete
ESC            --> Delete all
```

## Installing via uploaded ZIP file ##

1. Log in to your Moodle site as an admin and go to _Site administration >
   Plugins > Install plugins_.
2. Upload the ZIP file with the plugin code. You should only be prompted to add
   extra details if your plugin type is not automatically detected.
3. Check the plugin validation report and finish the installation.

## Installing manually ##

The plugin can be also installed by putting the contents of this directory to

    {your/moodle/dirroot}/blocks/simple_calculator

Afterwards, log in to your Moodle site as an admin and go to _Site administration >
Notifications_ to complete the installation.

Alternatively, you can run

    $ php admin/cli/upgrade.php

to complete the installation from the command line.

## License ##

2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <https://www.gnu.org/licenses/>.
