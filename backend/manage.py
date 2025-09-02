#!/usr/bin/env python
import os
import sys
from pathlib import Path


def main():
    base_dir = Path(__file__).resolve().parent
    # Make repo root importable so we can import from `models/`
    sys.path.append(str(base_dir.parent))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()

